import mongoose from "mongoose";

// 1. Định nghĩa cấu trúc bảng (Schema) cho tài khoản công ty
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Đảm bảo mỗi công ty chỉ có một email duy nhất
    },
    password: {
      type: String,
      required: true,
    },
    // --- Các thuộc tính mới thêm ---
    logo: {
      type: String, // Lưu đường dẫn (URL) hoặc tên file của logo
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    companyModel: {
      type: String, // Ví dụ: Sản phẩm, Outsource...
    },
    companyEmployees: {
      type: String, // Ví dụ: 50-100 nhân viên
    },
    workingTime: {
      type: String, // Ví dụ: Thứ 2 - Thứ 6
    },
    workOvertime: {
      type: String, // Ví dụ: Không OT / Có OT
    },
    phone: {
      type: String,
    },
    description: {
      type: String, // Mô tả chi tiết về công ty
    },
  },
  {
    // Tự động quản lý thời gian tạo (createdAt) và cập nhật (updatedAt)
    timestamps: true,
  }
);

// 2. Tạo Model kết nối với Collection "accounts-company"
const AccountCompany = mongoose.model("AccountCompany", companySchema, "accounts-company");

export default AccountCompany;