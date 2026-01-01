import { Router, type Request, type Response } from "express";
import { createBlogInput, updateBlogInput, updateBlogVisibilityInput } from "nikhlshrmadev-common-app";
import { authCheck } from "../middlewares/auth.middleware.js";
import z from "zod";
import { changeVisibility, createBlog, getAllBlogs, getBlog, getSelfBlogs, updateBlog } from "../services/blog.services.js";

export const blogRouter = Router();

/* POST /api/v1/blog
PUT /api/v1/blog
GET /api/v1/blog/:id
GET /api/v1/blog/bulk */

blogRouter.post("/" , authCheck , async(req:Request , res:Response)=>{
    try{const {success} = createBlogInput.safeParse(req.body);
    if(!success){
        return res.status(403).json({
            message:"Invalid input."
        })
    }
    const newPost = await createBlog(req.body , req.userId!);
    return res.status(200).json({
        message:"Added new post",
        newPost
    })}
    catch(e){
        return res.status(403).json({
            message:"Failed. Please try again"
        })
    }
})
blogRouter.put("/" ,authCheck , async (req:Request , res:Response)=>{

    try{const updateBlogBody = req.body;
    const {success} = updateBlogInput.safeParse(updateBlogBody);
    if(!success){
        return res.status(403).json({
            message:"Invalid input."
        })
    }
    const updatedBlog =await updateBlog(updateBlogBody , req.userId!);
     return res.status(200).json({
        message:"Updated post",
        updatedBlog
    })}
    catch(e){
        return res.status(403).json({
            message:"Failed. Please try again"
        })
    }
    
})

blogRouter.get("/bulk" ,authCheck , async(req:Request , res:Response)=>{
    const blogs = await getAllBlogs();
    return res.json(blogs)
})

blogRouter.get("/bulk/me" , authCheck , async(req:Request , res:Response)=>{
    const ownBlogs = await getSelfBlogs(req.userId!);
    res.json(ownBlogs);
})
blogRouter.get("/:id" ,authCheck , async(req:Request , res:Response)=>{
    const parsed = z.uuid().safeParse(req.params.id);
    if(!parsed.success){
        return res.status(400).json({
            message: "Invalid id"
        })
    }
    const Blog = await getBlog(parsed.data);
    if (!Blog) {
        return res.status(404).json({ message: "Blog not found" });
    }

    return res.json({
        message:"Fetched blog",
        Blog
    })
})
blogRouter.patch("/visibility" , authCheck , async(req:Request , res:Response)=>{
    const payload = updateBlogVisibilityInput.safeParse(req.body);
    if(!payload.success){
        return res.status(400).json({
            message:"Invalid input."
        })
    }
    const a = await changeVisibility(payload.data , req.userId!);
    if(!a){
        return res.status(403).json({
            message : "Failed to change the visibility."
        })
    }
    return res.json({
        message:"Changed visibility successfully"
    })
})
