//  to handle otp for new users
import { GENERATE_OTP } from "../../utils/handle-otp"
import { Response } from "express";
import { HASH_PASSWORD } from "../../utils/handle-password";
import { SET_OTP_SESSION } from "../../utils/handle-otp-session";
import { SET_USER } from "../../utils/handle-user";

import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from "../../types/index.types";

const SQL_QUERY = 'SELECT * FROM AUTH WHERE EMAIL=?;';

const NEW_USER = async (req: RequestType, res: Response) => {
    let connection;
    try {
        const BODY = req.body;
        const EMAIL: string = BODY.EMAIL;
        const NAME: string = BODY.NAME;
        const PASSWORD = BODY.PASSWORD;

        if (!EMAIL || !NAME || !PASSWORD) {
            res.status(400).send({ msg: "Field are required", code: "ERR_FIELD_NOT_FOUND" });
        }

        const HASHED_PASSWORD: string = await HASH_PASSWORD(PASSWORD);
        const USER_DATA = { EMAIL, NAME, PASSWORD: HASHED_PASSWORD };

        connection = await GET_CONNECTION(DATABASE_INSTANCE);

        const result = await QUERY(connection, SQL_QUERY, [EMAIL])

        if (result && result.length > 0) {
            return res.status(401).send({ msg: "Account exist", code: "ERR_ACCOUNT_EXIST" })
        }

        await SET_USER(USER_DATA);
        const OTP = GENERATE_OTP();
        const otp_session_id = await SET_OTP_SESSION({ EMAIL, OTP, SESSION_TYPE: "SIGNUP" });
        res.send({ msg: `Redirect user to /otp`, session: otp_session_id, OTP });

    }
    catch (err: any) {

        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }

    }
    finally {
        if (connection) {
            connection.release();

        }
    }
}


export default NEW_USER;