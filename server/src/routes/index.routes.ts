import { Router, Request, Response } from "express";

const INDEX_ROUTER = Router();


const CheckController = (req: Request, res: Response) => {

    const access_token = req.headers['access-token'];
    const session = req.headers['session'];

    console.log("Access Token:", access_token,
        "\nSession", session)
    if (access_token && session) {

        res.send("Header received");
    }
    else {
        res.status(400).send("Headers not received");
    }
}



INDEX_ROUTER.get('/', CheckController)
export default INDEX_ROUTER;