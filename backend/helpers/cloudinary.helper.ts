import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cấu hình thông số kết nối Cloudinary
cloudinary.config({
  // Sửa 'approx' thành 'env' để lấy dữ liệu từ file .env
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tạo cấu hình lưu trữ để tích hợp với Multer
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "it_jobs_uploads", // Tên thư mục trên Cloudinary
      allowed_formats: ["jpg", "png", "jpeg"], // Các định dạng file cho phép
    };
  },
});