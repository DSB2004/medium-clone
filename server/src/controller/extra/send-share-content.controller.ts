import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { GET_SHARE_ID_CONTENT } from "../../utils/handle-share-session";
import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
const BLOG_QUERY = 'SELECT * FROM BLOG_PROFILE WHERE BLOG_ID=?';

const USER_QUERY = 'SELECT * FROM USER_PROFILE WHERE USER_EMAIL=?'


const SEND_SHARE_CONTENT = async (req: RequestType, res: Response) => {

    const URL_QUERY = req.query;
    const type = URL_QUERY.type;
    const content = URL_QUERY.content;
    const share_id = URL_QUERY.id;

    let connection;
    if (!type || !content || !share_id || typeof (share_id) !== 'string') {
        res.status(400).send({ msg: "Field not given", code: "ERR_FIELD_NOT_FOUND" });
    }

    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        let result;
        // @ts-ignore
        const content: { share_content: string, type: string } = await GET_SHARE_ID_CONTENT(share_id);
        if (content.type === 'USER') {
            result = await QUERY(connection, USER_QUERY, [content.share_content]);
        }
        else if (content.type === 'BLOG') {
            result = await QUERY(connection, BLOG_QUERY, [content.share_content]);
        }
        res.send({ msg: "Content found", result });
    }
    catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === "ERR_LINK_EXPIRED") {
            console.log(err);
            return res.status(500).send({ msg: "Shared link has expired", code: "ERR_EXPIRED_LINK" });
        }
        else {
            console.log(err);
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" });
        }
    }

}


export default SEND_SHARE_CONTENT;