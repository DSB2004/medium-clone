import express from 'express';
import cors from 'cors';
import { VERSION } from './env';

import passport from './utils/handle-google-auth';

import TOKEN_MIDDLEWARE from './middlewares/token.middleware';
import INDEX_ROUTER from "./routes/index.routes";
import USER_ROUTER from './routes/user.routes';
import AUTH_ROUTER from './routes/auth.routes';
import REDIRECT_ROUTER from './routes/redirect.routes';
import GOOGLE_ROUTER from "./routes/google-auth.routes";
import FOLLOWER_ROUTER from './routes/followers.routes';
import BLOG_ROUTER from './routes/blog.routes';
import COMMENT_ROUTER from './routes/comments.routes';
const app = express();


app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());



app.use('/', INDEX_ROUTER);
app.use(`/auth/${VERSION}/`, AUTH_ROUTER);
app.use(`/redirect/${VERSION}`, REDIRECT_ROUTER);
app.use(`/auth/${VERSION}/googleauth`, GOOGLE_ROUTER);
// @ts-ignore
app.use(`/api/${VERSION}/users/`, TOKEN_MIDDLEWARE, USER_ROUTER);
// @ts-ignore
app.use(`/api/${VERSION}/blogs/`, TOKEN_MIDDLEWARE, BLOG_ROUTER);
// @ts-ignore
app.use(`/api/${VERSION}/followers/`, TOKEN_MIDDLEWARE, FOLLOWER_ROUTER);
// @ts-ignore
app.use(`/api/${VERSION}/comments`, TOKEN_MIDDLEWARE, COMMENT_ROUTER);

// console.log(VERSION)
export default app;

