import { session } from "passport";
import REDIS_CLIENT from "../redis";
import { GENERATE_ID } from "./handle-id";

export const CREATE_SHARE_ID = async (share_content: string, type: string) => {
    const session: string = GENERATE_ID();

    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.set(`share:${session}`, JSON.stringify({ id: share_content, type: type }), { EX: 604800 });
        return session;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION")
    }
}

export const GET_SHARE_ID_CONTENT = async (session: string) => {

    if (REDIS_CLIENT.isReady) {
        const share_content = await REDIS_CLIENT.get(`share:${session}`);
        if (share_content && share_content != null) {
            return JSON.parse(share_content);
        }
        else {
            throw new Error("ERR_LINK_EXPIRED")
        }
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION")
    }
}