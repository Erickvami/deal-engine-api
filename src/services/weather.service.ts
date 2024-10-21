import { WeatherCode } from '../models/enums/weather-code.enum';
import { CurrentWeather, WeatherApiResponse } from '../models/weather-response.model';
import { getWeatherDescription } from '../utils/weather.utils';
import RedisService from './redis.service';

class WeatherService {
    private readonly baseUrl: string = process.env.WEATHER_API_URL!;

    public async getCurrentWeather(iata_code: string, latitude: number, longitude: number): Promise<CurrentWeather | null> {
        const cachedWeather = RedisService.isRedisConnected ? await RedisService.get(`w:${iata_code}`) : null;
        if (cachedWeather) return cachedWeather;

        try {
            const response = await fetch(`${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            if (!response.ok) {
                console.error(`Error fetching weather data: ${response.statusText}`);
                return null;
            }

            const data: WeatherApiResponse = await response.json();
            const { current_weather } = data;
            const { temperature, windspeed, winddirection, is_day, weathercode, time } = current_weather || {};

            const currentWeather: CurrentWeather = {
                temperature,
                windspeed,
                winddirection,
                is_day: is_day ?? 0,
                weathercode: getWeatherDescription(weathercode as WeatherCode),
                time
            };

            if (RedisService.isRedisConnected)
                await RedisService.set(`w:${iata_code}`, currentWeather, parseInt(process.env.REDIS_EXPIRATION ?? '3600'));
            
            return currentWeather;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }
}

export default new WeatherService();