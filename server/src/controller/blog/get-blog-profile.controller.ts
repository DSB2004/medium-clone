import DATABASE_INSTANCE from "../../database";
import { GET_CONNECTION, QUERY } from "../../utils/handle-connection";
import { Response, Request } from "express";
import { RequestType } from "../../types/index.types";

const SQL_QUERY = 'SELECT * , (SELECT EXISTS ( SELECT 1 FROM BLOG_LIKES WHERE BLOG_ID = ? AND USER_EMAIL= ? )) AS "LIKED_BY_YOU" , (SELECT EXISTS ( SELECT 1 FROM BLOG_SAVES WHERE BLOG_ID = ? AND USER_EMAIL= ? )) AS "SAVED_BY_YOU" FROM BLOG_PROFILE WHERE BLOG_ID=?';


const GET_BLOG_PROFILE = async (req: RequestType, res: Response) => {
    const req_blog = req.req_blog;
    const user_email = req.user_email;

    let connection;

    if (!req_blog) {
        return res.status(403).send({ msg: "Invalid Request", code: "ERR_INVALID_REQUEST" });
    }
    try {
        connection = await GET_CONNECTION(DATABASE_INSTANCE);
        const result = await QUERY(connection, SQL_QUERY, [req_blog, user_email, req_blog, user_email, req_blog]);
        if (result && result.length > 0) {
            if (result[0]['SEARCH_KEYS']) {
                result[0]['SEARCH_KEYS'] = result[0]['SEARCH_KEYS'].split(',');
            }
            if (result[0]["IMAGE_LINKS"]) {
                result[0]["IMAGE_LINKS"] = result[0]["IMAGE_LINKS"].split(',');
            }
            return res.send({ msg: "Blog found", blog: result[0], owner: req.allowBlogAccess });
        }
        else {
            return res.send({ msg: "Blog not found", blog: null });
        }
    }
    catch (err: any) {
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

export default GET_BLOG_PROFILE;
