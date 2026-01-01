import type { Request } from "express";
//also smth new i learned
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
