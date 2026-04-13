import mongoose from "mongoose";

// 1. Định nghĩa cấu trúc (Schema) cho City
const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true // Thông thường tên thành phố là bắt buộc
    },
    // Bạn có thể thêm các trường khác nếu cần, ví dụ:
    // slug: String,
    // status: String
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
);

// 2. Tạo Model kết nối với Collection "cities"
const City = mongoose.model("City", citySchema, "cities");

export default City;