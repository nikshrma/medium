import { Router, type Request, type Response } from "express";
import jwt from 'jsonwebtoken';
import { signinInput, signupInput, type SigninInput, type SignupInput } from "nikhlshrmadev-common-app";
import { checkUserExistance, createUser, signInUser } from "../services/user.services.js";

export const userRouter = Router();

userRouter.post('/signup', async (req: Request, res: Response) => {
    const userPayload: SignupInput = req.body;
    const { success } = signupInput.safeParse(userPayload);
    const existingUserCheck = await checkUserExistance(userPayload.username);
    if (!success || existingUserCheck) {
        return res.status(400).json({
            message: "Invalid credentials or user already exists"
        })
    }
    const user = await createUser(userPayload);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_PASS as string);
    res.status(200).json({
        message: "User added successfully",
        token,
        user: {
            id: user.id,
            username: user.username,
            name: user.name
        }
    })

})

userRouter.post('/signin', async (req: Request, res: Response) => {
    const userPayload: SigninInput = req.body;
    const { success } = signinInput.safeParse(userPayload);
    const existingUser = await checkUserExistance(userPayload.username);
    if (!success || !existingUser) {
        return res.status(400).json({
            message: "User doesn't exist. Re-Direct to signup"
        })
    }
    const a: boolean = await signInUser(userPayload, existingUser.password);
    if (!a) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }
    const token = jwt.sign({ userId: existingUser.id }, process.env.JWT_PASS as string);
    return res.status(200).json({
        message: "Signed in successfully",
        token,
        user: {
            id: existingUser.id,
            username: existingUser.username,
            name: existingUser.name
        }
    })

})