import GET_BLOGS from "../controller/blog/get-blogs.controller";
import GET_BLOG_PROFILE from "../controller/blog/get-blog-profile.controller";
import ADD_BLOG from "../controller/blog/add-blog.controller";
import DELETE_BLOG from "../controller/blog/delete-blog.controller";
import UPDATE_BLOG from "../controller/blog/update-blog.controller";
import ADD_LIKE from "../controller/blog/add-like.controller";
import REMOVE_LIKE from "../controller/blog/remove-like.controller";
import { Router } from "express";
import BLOG_MIDDLEWARE from "../middlewares/blog.middleware";

const BLOG_ROUTER = Router();

// @ts-ignore
BLOG_ROUTER.get('/get-blogs', GET_BLOGS);
// @ts-ignore
BLOG_ROUTER.get('/get-blog-profile', BLOG_MIDDLEWARE, GET_BLOG_PROFILE);
// @ts-ignore
BLOG_ROUTER.post('/add-blog', ADD_BLOG);
// @ts-ignore
BLOG_ROUTER.delete('/delete-blog', BLOG_MIDDLEWARE, DELETE_BLOG);
// @ts-ignore
BLOG_ROUTER.patch('/update-blog', BLOG_MIDDLEWARE, UPDATE_BLOG);
// @ts-ignore
BLOG_ROUTER.put('/add-like', ADD_LIKE);
// @ts-ignore
BLOG_ROUTER.delete('/remove-like', REMOVE_LIKE);

export default BLOG_ROUTER;


