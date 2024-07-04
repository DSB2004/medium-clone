import { Response } from 'express';
import DATABASE_INSTANCE from '../../database';
import { GET_CONNECTION, QUERY } from '../../utils/handle-connection';
import { RequestType } from '../../types/index.types';
import { ADD_USER_ACCOUNT } from '../../utils/handle-user';


const USER_QUERY = 'INSERT INTO USERS (NAME, EMAIL, WORK_TYPE, BIO, PROFILE_PIC) VALUES (?, ?, ?, ?, ?)';
const USER_LINK_QUERY = 'INSERT INTO SOCIAL_LINKS (USER_ID, LINK) VALUES ?';

export const CREATE_USER = async (req: RequestType, res: Response) => {

    const BODY = req.body;
    const EMAIL = req.user_email;

    // field check
    if (!EMAIL || EMAIL === '') {
        return res.status(403).send({ msg: "Invalid request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();
        await ADD_USER_ACCOUNT(EMAIL);
        await QUERY(connection, USER_QUERY, [BODY.NAME, EMAIL, BODY.WORK_TYPE, BODY.BIO, BODY.PROFILE_PIC]);

        if (BODY.LINKS && BODY.LINKS.length > 0) {
            const SOCIAL_LINKS = BODY.LINKS.map((LINK: string) => [EMAIL, LINK]);
            await QUERY(connection, USER_LINK_QUERY, [SOCIAL_LINKS]);
        }

        connection.commit();
        return res.send({ msg: "User Created" });

    } catch (err: any) {
        if (connection) {
            connection.rollback();
        }
        if (err.message === "ERR_DUPLICATE_VALUE") {
            return res.status(400).send({ msg: "Account Exist", code: "ERR_ACCOUNT_EXIST" });
        }
        else if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

export default CREATE_USER;

