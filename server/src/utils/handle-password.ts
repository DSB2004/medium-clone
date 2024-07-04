import bcrypt from 'bcrypt';

export const HASH_PASSWORD: (PASSWORD: string) => Promise<string> = async (PASSWORD: string) => {

    return new Promise((resolve, reject) => {
        bcrypt.hash(PASSWORD, 10, (err, hash) => {
            if (err) {
                reject(new Error("ERR_HASHING"));
            }
            else if (hash) {
                resolve(hash);
            }

        })
    })
}



export const COMPARE_PASSWORD = async (HASHED_PASSWORD: string, USERPASSWORD: string) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(USERPASSWORD, HASHED_PASSWORD, (err, result) => {
            if (err) {
                reject(err)
            }
            else if (result) {
                resolve(result);
            }
            else {
                reject(new Error("ERR_INCORRECT_PASSWORD"))
            }
        })
    })
}