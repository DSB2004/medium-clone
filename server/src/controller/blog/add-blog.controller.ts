import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { GENERATE_ID } from "../../utils/handle-id";
import DATABASE_INSTANCE from "../../database";
import { ADD_BLOG_OWNERSHIP } from "../../utils/handle-blog-ownership";

const BLOG_QUERY = 'INSERT INTO BLOGS (ID, USER_EMAIL, HEADER, INTRO,INTRO_IMAGE, BODY) VALUES (?,?,?,?,?,?)';
const KEY_QUERY = 'INSERT INTO SEARCH_KEY (BLOG_ID, SEARCH_KEY) VALUES  ?';
const IMG_QUERY = 'INSERT INTO BLOG_IMAGES (BLOG_ID, IMAGE_LINK) VALUES ?';


const ADD_BLOG = async (req: RequestType, res: Response) => {
    const BODY = req.body;
    const user_email = req.user_email;
    if (!user_email) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    if (!BODY.HEADER || !BODY.INTRO) {
        return res.status(400).send({ msg: "Fields are required", code: "ERR_FIELD_NOT_FOUND" })
    }
    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        connection.beginTransaction();
        const ID = GENERATE_ID();
        await QUERY(connection, BLOG_QUERY, [ID, user_email, BODY.HEADER, BODY.INTRO, BODY.INTRO_IMAGE, BODY.BODY]);
        if (BODY.SEARCH_KEYS && BODY.SEARCH_KEYS.length > 0) {
            const SEARCH_KEYS = BODY.SEARCH_KEYS.map((KEY: string) => [ID, KEY]);
            await QUERY(connection, KEY_QUERY, [SEARCH_KEYS]);
        }
        if (BODY.IMGS && BODY.IMGS.length > 0) {
            const IMAGES = BODY.IMGS.map((IMG: string) => [ID, IMG]);
            await QUERY(connection, IMG_QUERY, [IMAGES]);
        }
        await ADD_BLOG_OWNERSHIP(user_email, ID);
        connection.commit();
        return res.send({ msg: "Blog added", BLOG_ID: ID });

    } catch (err: any) {
        connection?.rollback();
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        }
        else if (err.message === "ERR_DUPLICATE_VALUE") {
            return res.status(400).send({ msg: `Blog Exist`, code: "ERR_ACCOUNT_EXIST" });
        }
        else {
            console.log(err)
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }

    } finally {
        connection?.release();
    }


}

export default ADD_BLOG;