import { Response, Request } from "express";

const GOOGLE_SIGNIN = async (req: Request, res: Response) => {
    try {
        console.log("Request Made")
        res.redirect("/auth/v1/googleauth/authorise");
    } catch (err) {
        console.error("Error in GOOGLE_SIGNIN:", err);
        res.status(500).send({ msg: "Unable to generate Request" });
    }
};

export default GOOGLE_SIGNIN;