import { Repository } from 'typeorm';
import { AppDataSource } from '../data/database.provider';
import { Flight } from '../data/entities/flight.entity';
import weatherService from './weather.service';
import { CurrentWeather } from '../models/weather-response.model';
import redisService from './redis.service';

export class FlightService {
    private flightRepository: Repository<Flight>;

    constructor() {
        const db = AppDataSource;
        this.flightRepository = db.getRepository(Flight);
    }

    async get({ origin, destination }: { origin?: string | undefined, destination?: string | undefined } = {}): Promise<Flight[]> {
        const redisKey = `f:${origin ?? 'all'}_${destination ?? 'all'}`;
        let flights: Flight[] = [];
        
        const cachedFlights = redisService.isRedisConnected ? await redisService.get(redisKey) : null;

        flights = cachedFlights ? 
            cachedFlights : 
            await this.flightRepository.find({
                where: { 
                    ...(origin && { origin: { iataCode: origin } }), 
                    ...(destination && { destination: { iataCode: destination } }) 
                },
                relations: ['origin', 'destination', 'airline'],
                select: {
                    flightNum: true,
                    origin: { iataCode: true, lat: true, lng: true },
                    destination: { iataCode: true, lat: true, lng: true },
                    airline: { code: true }
                },
                order: {
                    origin: {
                        iataCode: 'ASC'
                    }
                }
            });

        if (!cachedFlights && redisService.isRedisConnected) await redisService.set(redisKey, flights, 1800);

        return await this.getWeatherForFlights(flights);
    }

    // private functions
    /**
     * fetchFlightWeatherGenerator is a generator function that fetches weather data for a list of flights.
     * @param flights - List of flights with origin and destination.
     * @param maxConcurrent - Maximum number of concurrent requests to the weather API.
     * The function uses a local dictionary (`weatherCache`) to avoid redundant requests:
     * - If the weather data for the origin or destination is in the dictionary, it reuses it.
     * - If not, it first checks Redis, and if it's not there, fetches it from the external API.
     * It controls concurrency using a set of active promises (`activeRequests`).
     * If the limit of concurrent requests is reached, it waits for one to finish before adding a new one.
     * The function yields each flight once its weather data is assigned.
     * Finally, it waits for all remaining requests to complete.
     */
    async *fetchFlightWeatherGenerator(flights: Flight[], maxConcurrent: number = 10) {
        const activeRequests = new Set<Promise<Flight>>();
        const weatherDict: { [key: string]: CurrentWeather | null } = {};

        const fetchWeather = async (flight: Flight) => {
            // searching origin weather in dictionary if not checking at redis, and if still not, requesting from external weather api
            if (!weatherDict[flight.origin.iataCode]) {
                flight.origin.currentWeather = 
                    await weatherService.getCurrentWeather(
                        flight.origin.iataCode, 
                        flight.origin.lat ?? 0, 
                        flight.origin.lng ?? 0
                    );
                weatherDict[flight.origin.iataCode] = flight.origin.currentWeather;
            } else flight.origin.currentWeather = weatherDict[flight.origin.iataCode];
            // searching destination weather in dictionary if not checking at redis, and if still not, requesting from external weather api
            if (!weatherDict[flight.destination.iataCode]) {
                flight.destination.currentWeather = 
                    await weatherService.getCurrentWeather(
                        flight.destination.iataCode, 
                        flight.destination.lat ?? 0, 
                        flight.destination.lng ?? 0
                    );
                weatherDict[flight.destination.iataCode] = flight.destination.currentWeather;
            } else flight.destination.currentWeather = weatherDict[flight.destination.iataCode];

            return flight;
        };
    
        for (const flight of flights) {
            const fetchWeatherPromise = fetchWeather(flight).then((resp) => {
                // removing from active requests once finishing
                activeRequests.delete(fetchWeatherPromise);
                return resp;
            });

            activeRequests.add(fetchWeatherPromise);

            // if we reach the max of concurrence then we wait
            if (activeRequests.size >= maxConcurrent) {
                await Promise.race(activeRequests);
            }
    
            yield await fetchWeatherPromise;
        }
        // wait to finish all active requests
        await Promise.all(activeRequests);
    }
    
    /**
     * Fetches weather data for a list of flights.
     * @param flights - List of flights to process.
     * @returns - Promise resolving to flights with weather data.
     * Uses a generator to fetch weather data with controlled concurrency, collecting
     * results and returning them once all requests are complete.
     */
    async getWeatherForFlights(flights: Flight[]): Promise<Flight[]> {
        const results: Flight[] = [];
        const generator = this.fetchFlightWeatherGenerator(
            flights, 
            parseInt(process.env.MAX_CONCURRENT_REQUESTS ?? '10')
        );
    
        for await (const flight of generator) results.push(flight);
    
        return results;
    }
}
