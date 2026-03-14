import mongoose from "mongoose";

// 1. Định nghĩa cấu trúc bảng (Schema) cho tài khoản công ty
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true // Đảm bảo mỗi công ty chỉ có một tài khoản duy nhất
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // Tự động quản lý thời gian tạo và cập nhật
    timestamps: true,
  }
);

// 2. Tạo Model kết nối với Collection "accounts-company"
const AccountCompany = mongoose.model("AccountCompany", companySchema, "accounts-company");

export default AccountCompany;