import bcrypt from "bcrypt";
import type { SigninInput, SignupInput } from "nikhlshrmadev-common-app"
import { prisma } from "../../db.js";
const saltRounds = 8;

export async function checkUserExistance(username : string){
    return await prisma.user.findUnique({
        where:{username}
    });
}
export async function createUser(userPayload: SignupInput){
    const userHash = await bcrypt.hash(userPayload.password , saltRounds)
    const user = await prisma.user.create({
        data:{
        username:userPayload.username,
        password:userHash,
        name:userPayload.name??null
        //smth new i learned
    }})
    return user;
}
export async function signInUser(userPayload: SigninInput  , hash: string){
    const a:boolean = await bcrypt.compare(userPayload.password , hash);
    return a;
}