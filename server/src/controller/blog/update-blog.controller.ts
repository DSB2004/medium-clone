import { GET_CONNECTION, QUERY } from '../../utils/handle-connection'
import { Response } from "express";
import DATABASE_INSTANCE from "../../database";
import { RequestType } from '../../types/index.types';


const UPDATE_BLOG_QUERY = 'UPDATE BLOGS SET HEADER=?,INTRO=?,BODY=?,INTRO_IMAGE=? WHERE ID=?;';

const DELETE_SEARCH_KEY_QUERY = 'DELETE FROM SEARCH_KEY WHERE BLOG_ID=?;'
const DELETE_IMG_QUERY = 'DELETE FROM BLOG_IMAGES WHERE BLOG_ID=?;'

const INSERT_KEY_QUERY = 'INSERT INTO SEARCH_KEY (BLOG_ID, SEARCH_KEY) VALUES  ?';
const INSERT_IMG_QUERY = 'INSERT INTO BLOG_IMAGES (BLOG_ID, IMAGE_LINK) VALUES ?';


const UPDATE_BLOG = async (req: RequestType, res: Response) => {
    const BODY = req.body;
    const blog_id = req.req_blog;

    if (!blog_id) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }

    let connection;
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);

        connection.beginTransaction();

        await QUERY(connection, UPDATE_BLOG_QUERY, [BODY.HEADER, BODY.INTRO, BODY.BODY, BODY.INTRO_IMAGE, blog_id]);


        if (BODY.SEARCH_KEYS && BODY.SEARCH_KEYS.length > 0) {

            await QUERY(connection, DELETE_SEARCH_KEY_QUERY, [blog_id]);

            const SEARCH_KEYS = BODY.SEARCH_KEYS.map((KEY: string) => [blog_id, KEY]);
            await QUERY(connection, INSERT_KEY_QUERY, [SEARCH_KEYS]);
        }

        if (BODY.IMGS && BODY.IMGS.length > 0) {
            await QUERY(connection, DELETE_IMG_QUERY, [blog_id]);
            const IMAGES = BODY.IMGS.map((IMG: string) => [blog_id, IMG]);
            await QUERY(connection, INSERT_IMG_QUERY, [IMAGES]);

        }
        connection.commit();
        return res.send({ msg: "Blog updated" });

    } catch (err: any) {
        console.error(err);
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        } else {
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" });
        }
    } finally {
        connection?.release();
    }
}

export default UPDATE_BLOG;