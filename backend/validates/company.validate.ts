import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const registerPost = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Định nghĩa cấu trúc kiểm soát dữ liệu (Schema) cho Công ty
  const schema = Joi.object({
    companyName: Joi.string()
      .max(200)
      .required()
      .messages({
        "string.empty": "Vui lòng nhập tên công ty!",
        "string.max": "Vui lòng nhập tối đa 200 ký tự!",
        "any.required": "Vui lòng nhập tên công ty!",
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!",
        "any.required": "Vui lòng nhập email!",
      }),
    password: Joi.string()
      .min(8)
      .required()
      .custom((value, helpers) => {
        // Kiểm tra tính bảo mật của mật khẩu tương tự như phía Frontend
        if (!/[a-z]/.test(value)) return helpers.error("password.lowercase");
        if (!/[A-Z]/.test(value)) return helpers.error("password.uppercase");
        if (!/\d/.test(value)) return helpers.error("password.number");
        if (!/[^A-Za-z0-9]/.test(value)) return helpers.error("password.special");
        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải có ít nhất 8 ký tự!",
        "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
        "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
        "password.number": "Mật khẩu phải chứa chữ số!",
        "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
        "any.required": "Vui lòng nhập mật khẩu!",
      }),
  });

  // 2. Thực hiện kiểm chứng dữ liệu trong req.body
  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.json({
      code: "error",
      message: errorMessage,
    });
  }

  // 3. Dữ liệu hợp lệ, cho phép chuyển sang Controller
  next();
};

export const loginPost = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!",
      }),
    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
      }),
  })

  const { error } = schema.validate(req.body);
  if(error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage
    })
    return;
  }

  next();
}
