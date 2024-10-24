# Flight Service API

## Description

This a web api service to provide information about current flight tickets, including details such origin and destination airports with their weather. Using redis to manage cache and also managing errors. Designed to be scalable and enough efficient to manage about 3000 tickets per day in reports, managing concurrency and generators to avoid take excessive resources.

## Features

- Consult flights including a report with weather for all, by origin or destination.
- cache flights and weather using Redis to optimize processes.
- Manage global and specific errors depending on the origin of the error.
- Using rate limit and base helmet to improve performance and security.
- Connecting to a third part api in action to get forecast info https://api.open-meteo.com/v1/forecast.

## Techs

- **Node.js**
    - **Express.js**
    - **TypeScript**.
    - **Redis**
    - **Winston**
    - **dotenv**
    - **typeorm**
- **PostgreSql**
- **Redis**
- **Docker**

## Instalación

### Run
NOTE: If running locally make sure you have node js, typescript, postgresql and redis in your machine.

Clone the repo:
   ```bash
    git clone https://github.com/tu-usuario/flight-service-api.git
   ```
1. create a `.env` and if needed `ca.pem` file in project

### .env example
```bash
    PORT=3001
    DB_HOST={DB_HOST}
    DB_PORT={DB_PORT}
    DB_USER={DB_USER}
    DB_PASS={DB_PASS}
    DB_NAME={DB_NAME}
    DB_CA_PATH=../../ca.pem
    WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
    REDIS_HOST={REDIS_HOST}
    REDIS_PORT={REDIS_PORT}
    REDIS_EXPIRATION=3600
    MAX_CONCURRENT_REQUESTS=12
```
2. Run seed folder to add the base data to postgresql
    ```bash
        npm run seed
    ```
3. Make sure you are running redis
4. run the web api service
    ```bash
        npm run dev
        ... or...
        npm run build
        npm start
    ``` 


### With Docker
NOTE: make sure you have docker and docker-compose in your machine

1. build your service
    ```bash
       docker-compose up --build 
    ```

## Endpoints
    
`GET /api/flights`: Retrieve all flights with weather report by airport.

`GET /api/flights/from/:IATA_CODE`: Retrieve all flights by origin IATA code.

`GET /api/flights/to/:IATA_CODE`: Retrieve all flights by destination IATA code.

## Error management
Errors are managed in their respective services logging descriptions about the issue. In case the origin is not from a service or there is no catch for it then it goes directly to the middleware `error-handler.ts` which will automatically throw a 500 error to the user with the description.

