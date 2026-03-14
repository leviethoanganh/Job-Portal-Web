import mongoose from "mongoose";

// 1. Định nghĩa cấu trúc bảng (Schema) cho người dùng
const userSchema = new mongoose.Schema(
  {

    fullName :  String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar :  String,
    phone :  String
  },
  {
    // Tự động sinh ra trường createdAt và updatedAt
    timestamps: true,
  }
);

// 2. Tạo Model để tương tác với Collection "accounts-user" trong DB
const AccountUser = mongoose.model("AccountUser", userSchema, "accounts-user");

export default AccountUser;