import { Router } from "express";
import userRoutes from "./user.route";
import authRoutes from "./auth.route";
import companyRoutes from "./company.route";
import cityRoutes from "./city.route";
import uploadRoutes from "./upload.route";
import searchRoutes from "./search.route";
import jobRoutes from "./job.route";

const router = Router();

// Định nghĩa tiền tố /user cho tất cả các tuyến đường liên quan đến người dùng
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/city", cityRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);
router.use("/search", searchRoutes);
router.use("/job", jobRoutes);

export default router;