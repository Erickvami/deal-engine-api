import { DataSource } from 'typeorm';
import { Airline } from './entities/airline.entity';
import { Airport } from './entities/airport.entity';
import { Flight } from './entities/flight.entity';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS,
        database: process.env.DB_NAME || 'deal-engine-test',
        entities: [Airline, Airport, Flight],
        synchronize: true,
        logging: false
    });

export const createConnection = async () => {
    try {
        await AppDataSource.initialize();
        console.log(`database at: ${process.env.DB_HOST}: ${5432} connected`)
    } catch (error) {
        console.error('Error during Data Source initialization', error);
        throw error;
    }
};