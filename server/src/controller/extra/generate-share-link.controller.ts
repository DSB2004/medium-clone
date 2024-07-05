import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { CREATE_SHARE_ID } from "../../utils/handle-share-session";


const GENERATE_SHARE_LINK = async (req: RequestType, res: Response) => {

    const BODY = req.body;

    const type = BODY.SHARE_TYPE;
    const id = BODY.SHARE_TYPE_ID;

    try {
        const share_id = await CREATE_SHARE_ID(id, type);

        res.send({ msg: "Share id generated", id: share_id });
    }
    catch (err: any) {
        if (err.message === "ERR_DATABASE_CONNECTION" || err.message === "ERR_REDIS_CONNECTION") {
            return res.status(500).send({ msg: "Server side error", code: "ERR_DATABASE_CONNECTION" });
        } else {
            console.log(err);
            return res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" });
        }
    }

}


export default GENERATE_SHARE_LINK;