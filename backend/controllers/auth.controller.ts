import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../models/account-user.model";
import  AccountCompany  from  "../models/account-company.model" ;

export const check = async (req: Request, res: Response) => {
  try {
    // 1. Lấy token từ Cookie mà trình duyệt gửi lên
    const token = req.cookies.token;

    if (!token) {
      console.log("--- [Controller Check] Không có token để kiểm tra ---");
      return res.json({
        code: "error",
        message: "Token không hợp lệ!",
      });
    }

    // 2. Giải mã token bằng Secret Key
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload;
    const { id, email } = decoded;

    // 3. Truy vấn Database để đảm bảo tài khoản vẫn tồn tại
    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if ( existAccountUser )  {
      console.log("--- [Controller Check] Khớp User:", existAccountUser.fullName);
      const  infoUser = {
        id :  existAccountUser.id,
        fullName :  existAccountUser.fullName ,
        email :  existAccountUser.email,
        avatar :  existAccountUser.avatar,
        phone :  existAccountUser.phone,
      };

      res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoUser: infoUser,
      });

      return;
    }
    
    const existAccountCompany = await AccountCompany.findOne({
        _id: id,
        email: email
      });

    // 2. Trường hợp tìm thấy tài khoản hợp lệ
    if (existAccountCompany) {
      console.log("--- [Controller Check] Khớp Company:", existAccountCompany.companyName);
      const infoCompany = {
        id: existAccountCompany._id,
        companyName: existAccountCompany.companyName,
        email: existAccountCompany.email,
      };

      // Trả về kết quả thành công
      return res.json({
        code: "success",
        message: "Token hợp lệ!",
        infoCompany: infoCompany
        // Đã xóa infoUser vì không xác định được biến này từ đâu ra
      });
    }

    // 3. Trường hợp không tìm thấy tài khoản (Token giả mạo hoặc user đã bị xóa)
    res.clearCookie("token");
    return res.json({
      code: "error",
      message: "Token không hợp lệ hoặc tài khoản không tồn tại!"
    });

  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Token không hợp lệ!",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  // 1. Xóa cookie có tên "token" khỏi trình duyệt của người dùng
  res.clearCookie("token");

  // 2. Phản hồi về Frontend để thực hiện chuyển trang
  res.json({
    code: "success",
    message: "Đã đăng xuất!",
  });
};