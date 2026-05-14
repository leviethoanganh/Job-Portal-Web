import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import { AccountRequest } from "../interfaces/request.interface";
import mongoose from "mongoose";
import  AccountCompany  from  "../models/account-company.model" ;

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
};

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("--- [Middleware] Token not found ---");
      return res.json({ code: "error", message: "Please log in!" });
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;

    const existAccount = await AccountUser.findOne({
      _id: new mongoose.Types.ObjectId(decoded.id),
    });

    if (!existAccount) {
      console.log(`--- [Middleware] Clearing cookie: ID ${decoded.id} not found in DB ---`);
      res.clearCookie("token", COOKIE_OPTIONS);
      return res.json({ code: "error", message: "Account not found!" });
    }

    console.log("--- [Middleware] Authentication successful for:", existAccount.fullName);
    req.account = existAccount;
    next();
  } catch (error: any) {
    console.log("--- [Middleware] Clearing cookie: Token error ---", error.message);
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.json({ code: "error", message: "Invalid token!" });
  }
};

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token required!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await AccountCompany.findOne({
      _id: id,
      email: email
    });

    if (!existAccount) {
      res.clearCookie("token", COOKIE_OPTIONS);
      res.json({
        code: "error",
        message: "Invalid token!"
      });
      return;
    }

    req.account = existAccount;
    next();
  } catch (error) {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.json({
      code: "error",
      message: error
    });
  }
};
