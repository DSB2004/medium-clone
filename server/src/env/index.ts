import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';

dotenv.config();

// server
export const PORT: Number = Number(process.env.PORT) || 80;
export const JWT_SECRET: Secret = process.env.JWT_SECRET || "";
export const VERSION: string = process.env.VERSION || "";


// mysql 
export const DB_HOST: string = process.env.DB_HOST || "";
export const DB_PASSWORD: string = process.env.DB_PASSWORD || "";
export const DB_USERNAME: string = process.env.DB_USERNAME || "";
export const DB_DATABASE: string = process.env.DB_DATABASE || "";

// redis
export const REDIS_HOST: string = process.env.REDIS_HOST || "";
export const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || "";
export const REDIS_PORT: number = Number(process.env.REDIS_PORT) || 15286;


// google auth

export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET || "";