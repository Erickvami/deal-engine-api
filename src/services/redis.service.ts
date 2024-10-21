import { createClient, SetOptions } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisService {
    private redisClient;
    public isRedisConnected: boolean = true;

    constructor() {
        this.redisClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${parseInt(process.env.REDIS_PORT || '6379', 10)}`,
        });

        this.redisClient.on('error', (err) => {
            console.error('Redis error:', err);
            this.isRedisConnected = false;
        });

        this.redisClient.connect()
        .then(() => {
            console.log('connected to redis...');
            this.isRedisConnected = true;
        })
        .catch((err) => {
            console.error('Failed to connect to Redis:', err);
            this.isRedisConnected = false;
        });
    }

    public async set(key: string, value: any, expirationInSeconds?: number | undefined): Promise<void> {
        await this.redisClient.set(key, JSON.stringify(value), {
            EX: expirationInSeconds ?? parseInt(process.env.REDIS_EXPIRATION ?? '3600')
        } as SetOptions);
    }

    public async get(key: string): Promise<any | null> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }

    public async del(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}

export default new RedisService();