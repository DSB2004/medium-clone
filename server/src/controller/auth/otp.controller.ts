//  for handling otp verification
import { VERIFY_OTP } from "../../utils/handle-otp";
import { Response } from "express";
import { RequestType } from "../../types/index.types";
import { GET_OTP_SESSION } from "../../utils/handle-otp-session";
import { SET_AUTH_SESSION } from "../../utils/handle-auth-session";
const VALIDATE_OTP = async (req: RequestType, res: Response) => {
    const QUERY = req.query;
    const OTP = QUERY.OTP;
    const OTP_SESSION = req.headers['otp-session'];

    if (!OTP_SESSION || typeof (OTP_SESSION) !== 'string') {
        console.log("Session Missing")
        return res.status(400).send({ msg: "OTP session missing", code: "ERR_HEADER_NOT_FOUND" })
    }
    if (!OTP || typeof (OTP) !== 'string') {
        return res.status(400).send({ msg: "OTP is missing", code: "ERR_FIELD_NOT_FOUND" })

    }
    try {
        const token = await GET_OTP_SESSION(OTP_SESSION);
        const token_otp = token.OTP;
        const result = VERIFY_OTP(OTP);
        if (result && token_otp === OTP) {
            const auth_session = await SET_AUTH_SESSION({ EMAIL: token.EMAIL, SESSION_TYPE: token.SESSION_TYPE });
            return res.send({ msg: "User verified", session: auth_session });
        }
        else {
            return res.status(408).send({ msg: "OTP didn't matched" });
        }
    }
    catch (err: any) {
        console.log(err)
        if (err.message === 'ERR_REDIS_CONNECTION') {
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_DATABASE_CONNECTION" })
        }
        else if (err.message === 'ERR_REQUEST_TIMEOUT') {
            res.status(408).send({ msg: "Request Timeout", code: "ERR_REQUEST_TIMEOUT" })
        }
        else {
            res.status(500).send({ msg: "Internal Server Error", code: "ERR_SERVER_ERROR" })
        }
    }



}
// const VERIFY_OTP = async (req: Request, res: Response) => {




//     if (!OTP || !AUTH_SESSION_ID) {
//         return res.status(400).send({ msg: "Field are missing", errCode: "ERR_MISSING_FIELD" })
//     }


//     try {
//         const result = CompareOTP(OTP);
//         await REDIS_CLIENT.connect();
//         if (result) {
//             const AUTH_SESSION_TOKEN = await REDIS_CLIENT.get(`auth-session:${AUTH_SESSION_ID}`);
//             if (AUTH_SESSION_TOKEN) {
//                 try {
//                     const DECODED_AUTH_SESSION_TOKEN = await VerifyToken(AUTH_SESSION_TOKEN);
//                     console.log(DECODED_AUTH_SESSION_TOKEN)
//                     const AUTH_TOKEN_ID = v4();
//                     const SESSION_TYPE = DECODED_AUTH_SESSION_TOKEN.SESSION_TYPE;
//                     await SET_AUTH_TOKEN(DECODED_AUTH_SESSION_TOKEN.EMAIL, SESSION_TYPE, AUTH_TOKEN_ID);
//                     await REDIS_CLIENT.del(`auth-session:${AUTH_SESSION_ID}`);
//                     res.status(200).send({ msg: "User Verified", session_type: SESSION_TYPE, auth_token_id: AUTH_TOKEN_ID });// redirect
//                 }
//                 catch (err) {
//                     return res.status(401).send({ msg: "Request Time Out", errCode: "ERR_REQUEST_TIMEOUT" });
//                 }
//             }
//             else {
//                 return res.status(401).send({ msg: "Request Time Out", errCode: "ERR_REQUEST_TIMEOUT" });
//             }
//         }
//         else {
//             res.status(401).send({ msg: "OTP didn't matched", errCode: "ERR_OTP_INVALID" });
//         }
//     }
//     catch (err) {
//         return res.status(500).send({ msg: "Server side error" })
//     }
//     finally {
//         if (REDIS_CLIENT.isReady) {
//             await REDIS_CLIENT.disconnect();
//         }
//     }


// }
export default VALIDATE_OTP;