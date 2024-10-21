import { AppDataSource, createConnection } from '../src/data/database.provider';
import { Airline } from '../src/data/entities/airline.entity'
import { Airport } from '../src/data/entities/airport.entity'
import { Flight } from '../src/data/entities/flight.entity'
import * as fs from 'fs';
import path from 'path';
import { parse } from 'papaparse';
import { Row } from './row.model';

const filePath = path.join(__dirname, './challenge_dataset.csv');
const readCSV = async (): Promise<Row[]> => parse<Row>(fs.readFileSync(filePath, 'utf8'), { header: true })?.data ?? [];
const db = AppDataSource;

const seedDatabase = async () => {
  await createConnection();
  
  const flightRepo = db.getRepository(Flight);
  if (!(await flightRepo.count())) {
    console.warn('starting data already exist, skippping seed...');
    return;
  }
  
  const data: Row[] = await readCSV();

  const airlineMap: { [code: string]: Airline } = {};
  const airportMap: { [iataCode: string]: Airport } = {};

  data.forEach(row => {
    // Add Airlines in the airportMap dictionary
    if (!airlineMap[row.airline]) {
        airlineMap[row.airline] = new Airline();
        airlineMap[row.airline].code = row.airline;
    }

    // Add origin Airport in airportMap dictionary
    if (!airportMap[row.origin_iata_code]) {
        airportMap[row.origin_iata_code] = new Airport();
        airportMap[row.origin_iata_code].iataCode = row.origin_iata_code;
        airportMap[row.origin_iata_code].name = row.origin_name;
        airportMap[row.origin_iata_code].lat = parseFloat(row.origin_latitude);
        airportMap[row.origin_iata_code].lng = parseFloat(row.origin_longitude);
    }

    // Add destination Airport in airportMap dictionary
    if (!airportMap[row.destination_iata_code]) {
        airportMap[row.destination_iata_code] = new Airport();
        airportMap[row.destination_iata_code].iataCode = row.destination_iata_code;
        airportMap[row.destination_iata_code].name = row.destination_name;
        airportMap[row.destination_iata_code].lat = parseFloat(row.destination_latitude);
        airportMap[row.destination_iata_code].lng = parseFloat(row.destination_longitude);
    }
  }); 

  await db.manager.save(Airline, Object.values(airlineMap));
  await db.manager.save(Airport, Object.values(airportMap));

  const flightArray: Flight[] = data.map(row => {
    const flight = new Flight();
    flight.flightNum = row.flight_num;
    flight.origin = airportMap[row.origin_iata_code];
    flight.destination = airportMap[row.destination_iata_code];
    flight.airline = airlineMap[row.airline];
    return flight;
  });

  await db.manager.save(Flight, flightArray);

  console.log('csv inserted successfully!');
}

// starting seed
seedDatabase().catch(err => console.log(err));