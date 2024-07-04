import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response, Request } from "express";
import DATABASE_INSTANCE from "../../database";


const UPDATE_COMMENT_QUERY = 'UPDATE BLOG_COMMENTS SET BODY=? WHERE ID=?;';

const UPDATE_COMMENT = async (req: Request, res: Response) => {
    const BODY = req.body;
    const req_comment = req.headers['req-comment'];

    if (!req_comment || typeof (req_comment) !== 'string') {
        return res.status(400).send({ msg: "Fields are required", code: "ERR_FIELD_NOT_FOUND" })
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);

        await QUERY(connection, UPDATE_COMMENT_QUERY, [BODY.BODY, req_comment]);

        return res.send({ msg: "Comment updated" });

    } catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    } finally {
        connection?.release();
    }



}

export default UPDATE_COMMENT;