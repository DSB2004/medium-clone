// Signup: User enter their credentials for account creation

import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import DATABASE_INSTANCE from "../../database";
import { GET_USER, USER_LOGIN } from "../../utils/handle-user";
import { CREATE_TOKEN } from "../../utils/handle-jwt";
import { GENERATE_ID } from "../../utils/handle-id";
const SQL_QUERY = 'INSERT INTO AUTH  (NAME,EMAIL,PASSWORD) VALUES (?,?,?)';


const USER_SIGNUP = async (req: RequestType, res: Response) => {


    const AUTH_EMAIL = req.auth_email;
    const SESSION_TYPE = req.session_type;


    if (!AUTH_EMAIL || SESSION_TYPE !== 'SIGNUP') {
        return res.status(400).send({ msg: "Unauthorised request", errCode: "ERR_INVALID_REQUEST" });
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();
        const USER_DATA = await GET_USER(AUTH_EMAIL);
        await QUERY(connection, SQL_QUERY, [USER_DATA.NAME, AUTH_EMAIL, USER_DATA.PASSWORD]);
        const access_token_id = await USER_LOGIN(AUTH_EMAIL);
        const access_token = CREATE_TOKEN({ NAME: USER_DATA.NAME, EMAIL: AUTH_EMAIL, TOKEN_ID: access_token_id }, '1w');
        connection.commit();
        // return res.redirect(`/success?token=${access_token}`);
        return res.header({ access_token }).send({ msg: "Signup successful" });
    }
    catch (err: any) {
        if (connection) {
            connection.rollback();
        }
        if (err.message === "ERR_DUPLICATE_VALUE") {
            return res.status(400).send({ msg: "Account Exist", code: "ERR_ACCOUNT_EXIST" });
        }
        else if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === 'INVALID_TOKEN') {
            res.status(408).send({ msg: "Request Timeout", code: "ERR_REQUEST_TIMEOUT" })
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
}

export default USER_SIGNUP;