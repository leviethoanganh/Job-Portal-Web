"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPost = exports.detail = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const cv_model_1 = __importDefault(require("../models/cv.model"));
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield job_model_1.default.findOne({
            _id: id
        });
        if (record) {
            const jobDetail = {
                id: record.id,
                title: record.title,
                companyName: "",
                salaryMin: record.salaryMin,
                salaryMax: record.salaryMax,
                images: record.images,
                position: record.position,
                workingForm: record.workingForm,
                companyAddress: "",
                technologies: record.technologies,
                description: record.description,
                companyId: record.companyId,
                companyLogo: "",
                companyModel: "",
                companyEmployees: "",
                companyWorkingTime: "",
                companyWorkOvertime: ""
            };
            const accountCompany = yield account_company_model_1.default.findOne({
                _id: record.companyId
            });
            if (accountCompany) {
                jobDetail.companyName = `${accountCompany.companyName}`;
                jobDetail.companyAddress = `${accountCompany.address}`;
                jobDetail.companyLogo = `${accountCompany.logo}`;
                jobDetail.companyModel = `${accountCompany.companyModel}`;
                jobDetail.companyEmployees = `${accountCompany.companyEmployees}`;
                jobDetail.companyWorkingTime = `${accountCompany.workingTime}`;
                jobDetail.companyWorkOvertime = `${accountCompany.workOvertime}`;
            }
            res.json({
                code: "success",
                Message: "Thành công!",
                jobDetail: jobDetail
            });
        }
        else {
            res.json({
                code: "error",
                Message: "Thất bại!"
            });
        }
    }
    catch (error) {
        res.json({
            code: "error",
            Message: "Thất bại!"
        });
    }
});
exports.detail = detail;
const applyPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Gán đường dẫn file từ multer (cloudinary) vào body trước khi lưu
        req.body.fileCV = req.file ? req.file.path : "";
        // Khởi tạo bản ghi mới từ dữ liệu gửi lên
        const newRecord = new cv_model_1.default(req.body);
        yield newRecord.save();
        res.json({
            code: "success",
            message: "Đã gửi CV thành công!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Gửi CV không thành công. Vui lòng gửi lại!"
        });
    }
});
exports.applyPost = applyPost;
