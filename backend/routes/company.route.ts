import { Router } from "express";
import * as companyController from "../controllers/company.controller";
import * as companyValidate from "../validates/company.validate";

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


export default router;