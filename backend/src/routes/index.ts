import { Router } from "express";
import { userRouter } from "./user.routes.js";
import { blogRouter } from "./blog.routes.js";

export const rootRouter = Router();
rootRouter.use('/user' , userRouter);
rootRouter.use('/blog' , blogRouter);
