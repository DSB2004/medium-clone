import REDIS_CLIENT from "../redis"
import { GENERATE_ID } from "./handle-id";


//  for signup 
export const GET_USER = async (email: string): Promise<{ EMAIL: string, NAME: string, PASSWORD: string }> => {
    if (REDIS_CLIENT.isReady) {
        const user = await REDIS_CLIENT.get(`user:${email}`);
        if (!user || user === null) {
            throw new Error("REQUEST_TIMEOUT");
        }
        return JSON.parse(user);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
};

export const SET_USER = async (obj: { EMAIL: string, NAME: string, PASSWORD: string }): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        const data = JSON.stringify(obj);
        await REDIS_CLIENT.set(`user:${obj.EMAIL}`, data, { EX: 300 });
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
};


//  to check if user logged in or not
export const USER_LOGIN = async (email: string) => {
    const id = GENERATE_ID();
    if (REDIS_CLIENT.isReady) {
        const res = await REDIS_CLIENT.hSet('loggedIn', email, id);
        console.log(res)
        return id;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}
export const USER_LOGOUT = async (email: string) => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.hDel('loggedIn', email);
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const CHECK_USER_LOGIN = async (email: string, id: string): Promise<Boolean> => {
    if (REDIS_CLIENT.isReady) {
        const tokenid = await REDIS_CLIENT.hGet('loggedIn', email);
        return tokenid === id;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

// to check if user account exist
export const ADD_USER_ACCOUNT = async (email: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sAdd('account', email);
        return;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}


export const REMOVE_USER_ACCOUNT = async (email: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sRem('account', email);
        return;
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const CHECK_USER_ACCOUNT = async (email: string): Promise<boolean> => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.sIsMember('account', email);
    }
    else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

