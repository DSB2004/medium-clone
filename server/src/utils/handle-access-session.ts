import REDIS_CLIENT from "../redis";
import { GENERATE_ID } from "./handle-id";


export const SET_ACCESS_SESSION: (email: string) => Promise<string> = async (email: string) => {
    const session: string = GENERATE_ID();
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.set(`access-session:${email}`, session, { EX: 3600 * 5 });
        return session;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION")
    }
}


export const GET_ACCESS_SESSION: (email: string) => Promise<string> = async (email: string) => {
    if (REDIS_CLIENT.isReady) {
        const access_session = await REDIS_CLIENT.get(`access-session:${email}`);
        if (access_session && access_session !== null) {
            return access_session;
        }
        else {
            throw new Error("ERR_SESSION_NOT_FOUND");
        }
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}


export const REMOVE_ACCESS_SESSION: (email: string) => Promise<void> = async (email: string) => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.del(`access-session:${email}`);
        return;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}