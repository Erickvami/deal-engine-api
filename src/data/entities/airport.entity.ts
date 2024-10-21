import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, DeleteDateColumn, CreateDateColumn, Index } from 'typeorm';
import { Flight } from './flight.entity';
import { CurrentWeather } from '../../models/weather-response.model';

@Entity({name: 'Airports'})
export class Airport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: 'text' })
    iataCode!: string;

    @Column({ type: 'text' })
    name?: string;

    @Column('decimal', { precision: 10, scale: 6 })
    lat?: number = 0;

    @Column('decimal', { precision: 10, scale: 6 })
    lng?: number = 0;

    @UpdateDateColumn({ name: 'updatedAt', nullable: true})
    updatedAt?: Date | null;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true})
    deletedAt?: Date | null;

    @CreateDateColumn({ name: 'createdAt', nullable: true})
    createdAt?: Date | null;

    @OneToMany(() => Flight, (flight) => flight.origin)
    originFlights?: Flight[];

    @OneToMany(() => Flight, (flight) => flight.destination)
    destinationFlights?: Flight[];

    currentWeather?: CurrentWeather | null
}