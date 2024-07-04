import REDIS_CLIENT from "../redis";


export const GET_BLOG_OWNERSHIP = async (useremail: string): Promise<string[]> => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.sMembers(`blogs:${useremail}`);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const ADD_BLOG_OWNERSHIP = async (useremail: string, blog_id: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sAdd(`blogs:${useremail}`, blog_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const REMOVE_BLOG_OWNERSHIP = async (useremail: string, blog_id: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sRem(`blogs:${useremail}`, blog_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const DELETE_USER_BLOG_OWNERSHIP = async (useremail: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.del(`blogs:${useremail}`);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const CHECK_BLOG_OWNERSHIP = async (useremail: string, blog_id: string): Promise<boolean> => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.sIsMember(`blogs:${useremail}`, blog_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}