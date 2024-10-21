import express, { Application } from 'express';
import { createConnection } from './data/database.provider';
import { errorHandler } from './middlewares/error-handler';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import flightRoutes from './routes/flight.routes';


dotenv.config();
const PORT = process.env.PORT || 3001;
const app: Application = express();

app.use(express.json());
// adding extra security layer
app.use(helmet());
// adding cors
app.use(cors());
// adding limit of requests
app.use(rateLimit({
    windowMs: 900000, //15 * 60 * 1000 = 900000
    max: 100
}));

// route controllers
app.use('/api/flights', errorHandler, flightRoutes);
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// initialize database and server
createConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Error during Data Source initialization', error);
});
