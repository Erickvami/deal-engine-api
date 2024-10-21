import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Airport } from './airport.entity';
import { Airline } from './airline.entity';

@Entity({name: 'Flights'})
export class Flight {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({type: 'text'})
    flightNum!: string;

    @Column({type: 'timestamp with time zone', nullable: true})
    schedules?: Date | null

    @UpdateDateColumn({ name: 'updatedAt', nullable: true})
    updatedAt?: Date | null;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true})
    deletedAt?: Date | null;

    @CreateDateColumn({ name: 'createdAt', nullable: true})
    createdAt?: Date | null;

    @ManyToOne(() => Airport, (airport) => airport.originFlights)
    origin!: Airport;

    @ManyToOne(() => Airport, (airport) => airport.destinationFlights)
    destination!: Airport;

    @ManyToOne(() => Airline, (airline) => airline.flights)
    airline?: Airline;
}