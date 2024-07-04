
import { Response, Request } from "express"
import DATABASE_INSTANCE from "../../database"
import { COMPARE_PASSWORD } from "../../utils/handle-password";
import { CREATE_TOKEN } from "../../utils/handle-jwt";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { USER_LOGIN } from "../../utils/handle-user";

const SQL_QUERY = 'SELECT * FROM AUTH WHERE EMAIL=?';

const USER_SIGNIN = async (req: Request, res: Response) => {

    const BODY = req.body;
    const EMAIL = BODY.EMAIL;
    const PASSWORD = BODY.PASSWORD;


    if (!EMAIL || !PASSWORD) {
        res.status(400).send({ msg: "Field are required", code: "ERR_FIELD_NOT_FOUND" });
    }

    let connection;

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [EMAIL]);
        if (result && result.length > 0) {
            const DATABASE_PASSWORD = result[0]['PASSWORD'];
            await COMPARE_PASSWORD(DATABASE_PASSWORD, PASSWORD);
            const access_token_id = await USER_LOGIN(EMAIL);
            const access_token = CREATE_TOKEN({ TOKEN_ID: access_token_id, NAME: result[0].NAME, EMAIL: EMAIL}, '1w');
            // return res.redirect(`/success?token=${access_token}`);
            return res.status(200).header({ access_token }).send({ msg: "User Verified" });
        }
        else {
            return res.status(401).send({ msg: "No account found", code: "ERR_ACCOUNT_NOT_FOUND" });
        }
    } catch (err: any) {
        console.log(err.message)
        if (err.message === "ERR_INCORRECT_PASSWORD") {
            return res.status(401).send({ msg: "Incorrect Password", code: "ERR_INCORRECT_PASSWORD" });
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

}

export default USER_SIGNIN;