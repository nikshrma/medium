import { Router, type Request, type Response } from "express";

export const blogRouter = Router();

/* POST /api/v1/blog
PUT /api/v1/blog
GET /api/v1/blog/:id
GET /api/v1/blog/bulk */

blogRouter.post("/" , (req:Request , res:Response)=>{

})
blogRouter.put("/" , (req:Request , res:Response)=>{
    
})
blogRouter.get("/:id" , (req:Request , res:Response)=>{
    
})
blogRouter.get("/bulk" , (req:Request , res:Response)=>{
    
})