"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController = __importStar(require("../controllers/company.controller"));
const companyValidate = __importStar(require("../validates/company.validate"));
const authMiddleware = __importStar(require("../middlewares/auth.middleware"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_helper_1 = require("../helpers/cloudinary.helper");
const upload = (0, multer_1.default)({ storage: cloudinary_helper_1.storage });
const router = (0, express_1.Router)();
// Định nghĩa route POST cho việc đăng ký tài khoản công ty
// Route này sử dụng middleware validation trước khi gửi dữ liệu đến controller
router.post("/register", companyValidate.registerPost, companyController.registerPost);
router.post("/login", companyValidate.loginPost, companyController.loginPost);
router.patch("/profile", authMiddleware.verifyTokenCompany, upload.single("logo"), companyController.profilePatch);
router.post("/job/create", 
// 1. Kiểm tra quyền: Chỉ công ty có Token hợp lệ mới được đăng bài
authMiddleware.verifyTokenCompany, 
// 2. Xử lý ảnh: Cho phép upload tối đa 8 ảnh với field name là "images"
upload.array("images", 8), 
// 3. Xử lý logic: Lưu thông tin vào Database
companyController.createJobPost);
router.get("/job/list", 
// 1. Lớp bảo vệ: Chỉ cho phép Công ty có Token hợp lệ truy cập
authMiddleware.verifyTokenCompany, 
// 2. Xử lý logic: Truy vấn dữ liệu từ Database và trả về cho Frontend
companyController.listJob);
router.get("/job/edit/:id", authMiddleware.verifyTokenCompany, // Xác thực quyền công ty
companyController.editJob // Trả về dữ liệu jobDetail
);
router.patch("/job/edit/:id", authMiddleware.verifyTokenCompany, // Xác thực quyền công ty
upload.array("images", 8), // Xử lý tối đa 8 ảnh mới từ FilePond
companyController.editJobPatch // Thực hiện lưu thay đổi vào DB
);
router.delete("/job/delete/:id", 
// 1. Xác thực: Đảm bảo chỉ tài khoản Công ty mới có quyền gọi API này
authMiddleware.verifyTokenCompany, 
// 2. Logic: Tìm và xóa bản ghi trong Database
companyController.deleteJobDel);
router.get("/top", companyController.top);
router.get("/list", companyController.list);
router.get("/detail/:id", companyController.detail);
router.get("/cv/list", authMiddleware.verifyTokenCompany, companyController.listCV);
router.get("/cv/detail/:id", authMiddleware.verifyTokenCompany, companyController.detailCV);
router.patch("/cv/change-status", authMiddleware.verifyTokenCompany, companyController.changeStatusCVPatch);
router.delete("/cv/delete/:id", authMiddleware.verifyTokenCompany, companyController.deleteCVDel);
exports.default = router;
