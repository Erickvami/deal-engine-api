import request from 'supertest';
import { AppDataSource, createConnection } from '../src/data/database.provider'; // Donde se crea la conexión de base de datos
import app from '../src/index'; // Asegúrate de exportar tu app desde un archivo central
import { Server } from 'http';

let server: Server;
process.env.NODE_ENV = 'test';

beforeAll(async () => {
    await createConnection();
    server = app.listen(3001);
});

afterAll(async () => {
  await AppDataSource.destroy();
  await server.close();
});

describe('Flight API Tests', () => {
  it('should get all flights', async () => {
    const response = await request(server).get('/api/flights');
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get flights by origin', async () => {
    const originCode = 'MEX';
    const response = await request(server).get(`/api/flights/from/${originCode}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].origin.iataCode).toBe(originCode);
    expect(response.body).toHaveLength(2051);
    const emptyresponse = await request(server).get(`/api/flights/from/KSA`);
    expect(emptyresponse.body).toHaveLength(0);
  });

  it('should get flights by destination', async () => {
    const destinationCode = 'LAX';
    const response = await request(server).get(`/api/flights/to/${destinationCode}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0].destination.iataCode).toBe(destinationCode);
    expect(response.body).toHaveLength(16);
    const emptyresponse = await request(server).get(`/api/flights/to/KSA`);
    expect(emptyresponse.body).toHaveLength(0);
  });

  it('should return 404 for invalid route', async () => {
    const response = await request(server).get('/api/invalidroute');
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
});
