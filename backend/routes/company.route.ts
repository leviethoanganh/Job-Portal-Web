import { Router } from "express";
import * as companyController from "../controllers/company.controller";
import * as companyValidate from "../validates/company.validate";
import * as authMiddleware from "../middlewares/auth.middleware";
import multer from "multer";
import { storage } from "../helpers/cloudinary.helper";

const upload = multer({ storage: storage });

const router = Router();

// Định nghĩa route POST cho việc đăng ký tài khoản công ty
// Route này sử dụng middleware validation trước khi gửi dữ liệu đến controller
router.post(
  "/register",
  companyValidate.registerPost,
  companyController.registerPost
);

router.post(
  "/login",
  companyValidate.loginPost,
  companyController.loginPost
);

router.patch(
  "/profile",
  authMiddleware.verifyTokenCompany,
  upload.single("logo"),
  companyController.profilePatch
);

router.post(
  "/job/create",
  // 1. Kiểm tra quyền: Chỉ công ty có Token hợp lệ mới được đăng bài
  authMiddleware.verifyTokenCompany,

  // 2. Xử lý ảnh: Cho phép upload tối đa 8 ảnh với field name là "images"
  upload.array("images", 8),

  // 3. Xử lý logic: Lưu thông tin vào Database
  companyController.createJobPost
);

router.get(
  "/job/list",
  // 1. Lớp bảo vệ: Chỉ cho phép Công ty có Token hợp lệ truy cập
  authMiddleware.verifyTokenCompany,

  // 2. Xử lý logic: Truy vấn dữ liệu từ Database và trả về cho Frontend
  companyController.listJob
);

router.get(
  "/job/edit/:id",
  authMiddleware.verifyTokenCompany, // Xác thực quyền công ty
  companyController.editJob         // Trả về dữ liệu jobDetail
);

router.patch(
  "/job/edit/:id",
  authMiddleware.verifyTokenCompany, // Xác thực quyền công ty
  upload.array("images", 8),         // Xử lý tối đa 8 ảnh mới từ FilePond
  companyController.editJobPatch    // Thực hiện lưu thay đổi vào DB
);

router.delete(
  "/job/delete/:id",
  // 1. Xác thực: Đảm bảo chỉ tài khoản Công ty mới có quyền gọi API này
  authMiddleware.verifyTokenCompany,
  // 2. Logic: Tìm và xóa bản ghi trong Database
  companyController.deleteJobDel
);

router.get(
  "/top",
  companyController.top
);

router.get(
  "/list",
  companyController.list
);

router.get("/detail/:id", companyController.detail);

router.get(
  "/cv/list",
  authMiddleware.verifyTokenCompany,
  companyController.listCV
);

router.get(
  "/cv/detail/:id",
  authMiddleware.verifyTokenCompany,
  companyController.detailCV
);

router.patch(
  "/cv/change-status",
  authMiddleware.verifyTokenCompany,
  companyController.changeStatusCVPatch
);

router.delete(
  "/cv/delete/:id",
  authMiddleware.verifyTokenCompany,
  companyController.deleteCVDel
);

export default router;