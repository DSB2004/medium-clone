import { JWT_SECRET } from "../env";
import jwt from "jsonwebtoken";
import { TOKEN } from "../types/index.types";


export const CREATE_TOKEN = (obj: any, expireIn: number | string) => {
    const token = jwt.sign(obj, JWT_SECRET, {
        expiresIn: expireIn,
    });
    return token;
}

export const DECODE_TOKEN = async (token: string): Promise<TOKEN> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error("INVALID_TOKEN"));
            } else {
                resolve(decoded as TOKEN);
            }
        });
    });
}
