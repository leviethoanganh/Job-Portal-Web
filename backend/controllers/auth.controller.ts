import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import  AccountCompany  from  "../models/account-company.model" ;

export const check = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("--- [Controller Check] No token found ---");
      return res.json({
        code: "error",
        message: "Invalid token!",
      });
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if ( existAccountUser )  {
      console.log("--- [Controller Check] Matched User:", existAccountUser.fullName);
      const  infoUser = {
        id :  existAccountUser.id,
        fullName :  existAccountUser.fullName ,
        email :  existAccountUser.email,
        avatar :  existAccountUser.avatar,
        phone :  existAccountUser.phone,
      };

      res.json({
        code: "success",
        message: "Token is valid!",
        infoUser: infoUser,
      });

      return;
    }

    const existAccountCompany = await AccountCompany.findOne({
        _id: id,
        email: email
      });

    if (existAccountCompany) {
      console.log("--- [Controller Check] Matched Company:", existAccountCompany.companyName);
      const infoCompany = {
        id: existAccountCompany._id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
        city: existAccountCompany.city,
        address: existAccountCompany.address,
        companyModel: existAccountCompany.companyModel,
        companyEmployees: existAccountCompany.companyEmployees,
        workingTime: existAccountCompany.workingTime,
        workOvertime: existAccountCompany.workOvertime,
        phone: existAccountCompany.phone,
        description: existAccountCompany.description,
        logo: existAccountCompany.logo,
      };

      return res.json({
        code: "success",
        message: "Token is valid!",
        infoCompany: infoCompany
      });
    }

    res.clearCookie("token", COOKIE_OPTIONS);
    return res.json({
      code: "error",
      message: "Invalid token or account not found!"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Invalid token!",
    });
  }
};

const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  sameSite: "none" as const,
  secure: true,
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);

  res.json({
    code: "success",
    message: "Logged out!",
  });
};
