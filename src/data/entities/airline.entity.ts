import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, DeleteDateColumn, CreateDateColumn, Index } from 'typeorm';
import { Flight } from './flight.entity';

@Entity({name: 'Airlines'})
export class Airline {
    @PrimaryGeneratedColumn()
    id!: number;

    @Index()
    @Column({ type: 'text' })
    code!: string;

    @UpdateDateColumn({ name: 'updatedAt', nullable: true})
    updatedAt?: Date | null;

    @DeleteDateColumn({ name: 'deletedAt', nullable: true})
    deletedAt?: Date | null;

    @CreateDateColumn({ name: 'createdAt', nullable: true})
    createdAt?: Date | null;

    @OneToMany(() => Flight, (flight) => flight.airline)
    flights?: Flight[];
}