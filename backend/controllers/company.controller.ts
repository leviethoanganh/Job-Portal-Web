import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AccountCompany from "../models/account-company.model";
import jwt from "jsonwebtoken";

export const registerPost = async (req: Request, res: Response) => {
  try {
    // 1. Nhận dữ liệu từ body của yêu cầu
    const { companyName, email, password } = req.body;

    // 2. Kiểm tra xem Email công ty đã tồn tại chưa
    const existAccount = await AccountCompany.findOne({
      email: email,
    });

    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
    }

    // 3. Mã hóa mật khẩu bảo mật cho doanh nghiệp
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 4. Tạo bản ghi mới sử dụng Model AccountCompany
    const newAccount = new AccountCompany({
      companyName: companyName,
      email: email,
      password: hash,
    });

    // 5. Lưu vào MongoDB
    await newAccount.save();

    // 6. Trả về phản hồi thành công
    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    console.error(error);
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
    
  // Kiểm tra email
  const existAccount = await AccountCompany.findOne({
    email: email
  });

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, `${existAccount.password}`);

  if(!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    });
    return;
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      id: existAccount._id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "1d"
    }
  );

  console.log("Email đăng nhập:", email);
  console.log("Token JWT đã tạo:", token);

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: (24 * 60 * 60 * 1000), // 1 ngày
    httpOnly: true, // Chỉ cho phép cookie được truy cập bởi server
    sameSite: "lax", // Cho phép lấy được cookie từ tên miền khác
    secure: false, // process.env.NODE_ENV === "production", // http: false, https: true
  });

  return res.json({
    code: "success",
    message: "Đăng nhập thành công!"
  })
}
