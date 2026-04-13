import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";

const router = Router();

// Khởi tạo middleware multer với cấu hình lưu trữ Cloudinary
const upload = multer({ storage: storage });

/**
 * Route: POST /upload/image
 * Chức năng: Upload một file ảnh duy nhất lên Cloudinary
 * Field name: "file" (TinyMCE thường gửi file qua field này)
 */
router.post(
  "/image",
  upload.single("file"), 
  uploadController.imagePost
);

export default router;