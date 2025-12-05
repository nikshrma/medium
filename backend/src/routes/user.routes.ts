import { Router, type Request, type Response } from "express";
import jwt from 'jsonwebtoken';
import type { SignupInput } from "nikhlshrmadev-common-app";

export const userRouter = Router();

userRouter.post('/signup' , (req : Request , res : Response)=>{
    const userPayload: SignupInput = req.body;

})

userRouter.post('/signin' , (req : Request , res : Response)=>{
    
})