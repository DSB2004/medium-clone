import { Router } from "express";
import VIEW_BLOGS from "../controller/extra/view-blogs";


const EXTRA_ROUTER = Router();

// @ts-ignore
EXTRA_ROUTER.get('/view-blogs', VIEW_BLOGS);


export default EXTRA_ROUTER;