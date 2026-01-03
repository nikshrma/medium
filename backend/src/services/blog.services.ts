import type { CreateBlogInput, UpdateBlogInput, UpdateBlogVisibilityInput } from "nikhlshrmadev-common-app";
import { prisma } from "../../db.js";

export async function createBlog(blogData: CreateBlogInput, userId: string) {
    const post = await prisma.post.create({
        data: {
            title: blogData.title,
            content: blogData.content,
            authorId: userId
        }
    })
    return post;
}
export async function updateBlog(updateBlogData: UpdateBlogInput, id: string) {
    const result = await prisma.post.updateMany({
        where: {
            id: updateBlogData.id,
            authorId: id
        },
        data: {
            ...(updateBlogData.title !== undefined && { title: updateBlogData.title }),
            ...(updateBlogData.content !== undefined && { content: updateBlogData.content })
        }
    });
    if (result.count === 0) {
        throw new Error("Post not found or unauthorized");
    }
    return await prisma.post.findUnique({
        where: {
            id: updateBlogData.id
        }
    })
}

export async function getBlog(id: string) {
    const post = await prisma.post.findUnique({
        where: {
            id
        }
    })
    return post;
}

export async function getAllBlogs() {
    const blogs = await prisma.post.findMany({
        where: {
            published: true
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            createdAt:true,
            published:true
        }

    })
    return blogs;
}

export async function getSelfBlogs(userId:string){
    const selfBlogs = await prisma.post.findMany({
        where:{
            authorId:userId
        },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            authorId: true,
            createdAt:true,
            published:true
        }
    })
    return selfBlogs;
}
export async function changeVisibility(payload:UpdateBlogVisibilityInput , userId:string){
    const result = await prisma.post.updateMany({
        where:{
            id:payload.id,
            authorId:userId
        },
        data:{
            published:payload.published
        }
    })
    return result.count;
}