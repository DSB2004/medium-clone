import { Request } from "express"
import { RequestHandler } from "express";

export interface TOKEN {
    NAME?: string | undefined,
    EMAIL: string
    OTP?: string | undefined,
    SESSION_TYPE?: string | undefined,
    TOKEN_ID?: string | undefined
}

export interface RequestType extends Request {
    auth_email: string,// for auth middleware
    user_email: string, // for token middleware
    alias_email: string,// for alias user 
    allowAccountAccess: boolean,  // fpr user account ownership
    allowBlogAccess: boolean,
    session_type: string,
    req_blog: string,
}

type TypedRequestHandler = RequestHandler<RequestType>;


export interface ErrorType extends Error {
    code: string
}