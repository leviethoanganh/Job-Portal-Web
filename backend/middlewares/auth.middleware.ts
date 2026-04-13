import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
// Giả sử AccountRequest là interface mở rộng từ Request để chứa thêm trường account
import { AccountRequest } from "../interfaces/request.interface";
import mongoose from "mongoose";
import  AccountCompany  from  "../models/account-company.model" ;

export const verifyTokenUser = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log("--- [Middleware] Không tìm thấy Token ---");
      return res.json({ code: "error", message: "Vui lòng đăng nhập!" });
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    
    // THAY ĐỔI: Ép kiểu ID về ObjectId để tìm kiếm chính xác
    const existAccount = await AccountUser.findOne({
      _id: new mongoose.Types.ObjectId(decoded.id), 
      // deleted: false  // Lưu ý: Nếu Schema của bạn chưa có trường deleted, hãy comment dòng này lại
    });

    if (!existAccount) {
      console.log(`--- [Middleware] XÓA COOKIE: ID ${decoded.id} không tồn tại trong DB ---`);
      res.clearCookie("token");
      return res.json({ code: "error", message: "Tài khoản không tồn tại!" });
    }

    console.log("--- [Middleware] Xác thực thành công cho:", existAccount.fullName);
    req.account = existAccount;
    next();
  } catch (error: any) {
    console.log("--- [Middleware] XÓA COOKIE: Token lỗi ---", error.message);
    res.clearCookie("token");
    return res.json({ code: "error", message: "Token không hợp lệ!" });
  }
};

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!"
      });
      return;
    }

    // Giải mã token
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    const existAccount = await AccountCompany.findOne({
      _id: id,
      email: email
    });

    if (!existAccount) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      });
      return;
    }

    req.account = existAccount;
    next();
  } catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: error
    });
  }
};

