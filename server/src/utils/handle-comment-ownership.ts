import REDIS_CLIENT from "../redis";


export const GET_COMMENT_OWNERSHIP = async (useremail: string): Promise<string[]> => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.sMembers(`comments: ${useremail}`);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const ADD_COMMENT_OWNERSHIP = async (useremail: string, comment_id: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sAdd(`comments: ${useremail}`, comment_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const REMOVE_COMMENT_OWNERSHIP = async (useremail: string, comment_id: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.sRem(`comments: ${useremail}`, comment_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const DELETE_USER_COMMENT_OWNERSHIP = async (useremail: string): Promise<void> => {
    if (REDIS_CLIENT.isReady) {
        await REDIS_CLIENT.del(`comments: ${useremail}`);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}

export const CHECK_COMMENT_OWNERSHIP = async (useremail: string, comment_id: string): Promise<boolean> => {
    if (REDIS_CLIENT.isReady) {
        return await REDIS_CLIENT.sIsMember(`comments: ${useremail}`, comment_id);
    } else {
        throw new Error("ERR_REDIS_CONNECTION");
    }
}