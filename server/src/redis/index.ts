import { createClient } from "redis";
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "../env";

const REDIS_CLIENT = createClient({
    password: REDIS_PASSWORD,
    socket: {
        port: REDIS_PORT,
        host: REDIS_HOST,
        reconnectStrategy: function (retries) {
            if (retries > 20) {
                console.log("Too many attempts to reconnect. Redis connection was terminated");
                return new Error("Too many retries.");
            } else {
                return retries * 500;
            }
        }
    }
});

REDIS_CLIENT.on('error', error => console.error('Redis client error:', error));
REDIS_CLIENT.on('connect', () => console.log("Redis client connected"));
REDIS_CLIENT.on('disconnect', () => console.log("Redis client disconnected"));

export default REDIS_CLIENT;

