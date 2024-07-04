import REDIS_CLIENT from "../redis";
import { TOKEN } from "../types/index.types";
import { GENERATE_ID } from "./handle-id";
import { CREATE_TOKEN, DECODE_TOKEN } from "./handle-jwt";


export const SET_OTP_SESSION: (obj: TOKEN) => Promise<string> = async (obj: TOKEN) => {
    const session: string = GENERATE_ID();
    const token: string = CREATE_TOKEN(obj, 120);
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.set(`otp-session:${session}`, token, { EX: 120 });
        return session;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION")
    }
}


export const GET_OTP_SESSION: (session: string) => Promise<{ EMAIL: string, OTP: string, SESSION_TYPE: string }> = async (session: string) => {
    if (REDIS_CLIENT.isReady) {
        const token = await REDIS_CLIENT.get(`otp-session:${session}`);
        if (token && token !== null) {
            const DECODED_TOKEN = await DECODE_TOKEN(token);
            await REDIS_CLIENT.del(`otp-session:${session}`);
            return { EMAIL: DECODED_TOKEN.EMAIL, OTP: DECODED_TOKEN.OTP || "", SESSION_TYPE: DECODED_TOKEN.SESSION_TYPE || "" };
        }
        else {
            throw new Error("ERR_REQUEST_TIMEOUT");
        }
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

