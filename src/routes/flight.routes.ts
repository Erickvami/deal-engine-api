import { Router } from "express";
import flightsController from "../controllers/flights.controller";

const router = Router();

router.get('/', flightsController.getFlights);
router.get('/from/:origin', flightsController.getFlightsByOrigin);
router.get('/to/:destination', flightsController.getFlightsByDestination);

export default router;