import { NextFunction, Request, Response } from 'express';
import { FlightService } from '../services/flight.service';
import { AppError } from '../middlewares/error-handler';
import { next } from 'stylis';

class FlightsController {
    private flightsService: FlightService;

    constructor() {
        this.flightsService = new FlightService;
    }

    public getFlights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await this.flightsService.get());
        } catch (error: any) {
            next(error);
        }
    }
    
    public getFlightsByOrigin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.params?.origin) res.status(200).json([]);
            res.status(200).json(await this.flightsService.get({ origin: req.params.origin as string}));
        } catch (error: any) {
            next(error);
        }
    }

    public getFlightsByDestination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.params?.destination) res.status(200).json([]);
            res.status(200).json(await this.flightsService.get({ destination: req.params.destination as string}));
        } catch (error: any) {
            next(error);
        }
    }
}

export default new FlightsController();