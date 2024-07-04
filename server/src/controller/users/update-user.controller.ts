import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { RequestType } from "../../types/index.types";


const USER_SQL_QUERY = 'UPDATE USERS SET WORK_TYPE=?, BIO=?, PROFILE_PIC=? WHERE EMAIL=?';
const DELETE_LINK_QUERY = 'DELETE FROM SOCIAL_LINKS WHERE USER_EMAIL=?';
const INSERT_LINK_QUERY = 'INSERT INTO SOCIAL_LINKS (USER_EMAIL, LINK) VALUES ?';

const UPDATE_USER = async (req: RequestType, res: Response) => {
    const BODY = req.body;
    const EMAIL = req.user_email;

    let connection;

    if (!EMAIL || EMAIL === '') {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();
        await QUERY(connection, USER_SQL_QUERY, [BODY.WORK_TYPE, BODY.BIO, BODY.PROFILE_PIC, EMAIL]);
        if (BODY.LINKS) {
            const SOCIAL_LINKS = BODY.LINKS.map((LINK: string) => [EMAIL, LINK]);
            await QUERY(connection, DELETE_LINK_QUERY, [EMAIL]);
            await QUERY(connection, INSERT_LINK_QUERY, [SOCIAL_LINKS]);
        }
        connection.commit()
        res.send({ msg: "User updated successfully" });
    }
    catch (err: any) {
        connection?.rollback();
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }

    }
    finally {
        connection?.release();
    }
}

export default UPDATE_USER;