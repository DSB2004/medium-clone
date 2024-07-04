import { GENERATE_OTP } from "../../utils/handle-otp";
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { SET_OTP_SESSION } from "../../utils/handle-otp-session";


const SQL_QUERY = 'SELECT * FROM USERS WHERE EMAIL=?;';
const DELETE_USER_ACCOUNT = async (req: RequestType, res: Response) => {
    const URL_QUERY = req.query;
    const EMAIL = URL_QUERY.EMAIL;

    if (!EMAIL || typeof (EMAIL) !== 'string') {
        return res.status(400).send({ msg: "Email is missing", code: "ERR_FIELD_NOT_FOUND" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [EMAIL])
        if (!result || result.length === 0) {
            return res.status(401).send({ msg: "Account not found", code: "ERR_ACCOUNT_NOT_FOUND" })
        }
        const OTP = GENERATE_OTP();
        const session = await SET_OTP_SESSION({ SESSION_TYPE: "DELETE_ACCOUNT", EMAIL: EMAIL, OTP: OTP });
        // // mail function
        res.send({ msg: `Redirect user to /otp?`, session, OTP });
    }

    catch (err: any) {
        if (err.message === 'ERR_REDIS_CONNECTION') {
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" })
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }

    finally {
        if (connection) {
            connection.release();
        }
    }

}




export default DELETE_USER_ACCOUNT;