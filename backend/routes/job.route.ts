import { Router } from "express";
import * as jobController from "../controllers/job.controller";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";

const upload = multer({ storage });

const router = Router();

// Route lấy chi tiết công việc theo ID
// Ví dụ: GET /job/detail/65f123456789
router.get("/detail/:id", jobController.detail);
router.post("/apply", upload.single("fileCV"), jobController.applyPost);

export default router;