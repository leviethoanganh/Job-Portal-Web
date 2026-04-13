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
exports.search = void 0;
const job_model_1 = __importDefault(require("../models/job.model"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const city_model_1 = __importDefault(require("../models/city.model"));
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dataFinal = [];
    let totalRecord = 0;
    let totalPage = 1;
    try {
        const find = {};
        // 1. Ép kiểu query về string
        const language = req.query.language;
        const cityQuery = req.query.city;
        // 2. Lọc theo ngôn ngữ
        if (language) {
            find.technologies = { $regex: language, $options: "i" };
        }
        // 3. Lọc theo thành phố
        if (cityQuery) {
            // Tìm thành phố (ép kiểu any để tránh lỗi overload khi dùng $regex)
            const cityInfo = yield city_model_1.default.findOne({
                name: { $regex: cityQuery, $options: "i" }
            });
            if (cityInfo) {
                // LỖI TẠI ĐÂY: Ép kiểu _id về string để khớp với định nghĩa String trong Model
                const listAccountCompanyInCity = yield account_company_model_1.default.find({
                    city: cityInfo._id.toString()
                });
                // Lấy mảng ID công ty (ép về string)
                const companyIds = listAccountCompanyInCity.map((item) => item._id.toString());
                find.companyId = {
                    $in: companyIds
                };
            }
            else {
                return res.json({ code: "success", jobs: [] });
            }
        }
        if (req.query.company) {
            const accountCompany = yield account_company_model_1.default.findOne({
                companyName: req.query.company
            });
            find.companyId = accountCompany === null || accountCompany === void 0 ? void 0 : accountCompany.id;
        }
        // A safer way to handle this
        if (req.query.keyword) {
            // Escape special characters to prevent ReDoS
            const keyword = req.query.keyword;
            const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            find.title = { $regex: escapedKeyword, $options: "i" };
        }
        if (req.query.position) {
            find.position = req.query.position;
        }
        if (req.query.workingForm) {
            find.workingForm = req.query.workingForm;
        }
        const limitItems = 9;
        let page = 1;
        if (req.query.page) {
            page = parseInt(`${req.query.page}`);
        }
        totalRecord = yield job_model_1.default.countDocuments(find);
        totalPage = Math.ceil(totalRecord / limitItems);
        const skip = (page - 1) * limitItems;
        // 4. Truy vấn Job
        const jobs = yield job_model_1.default.find(find).sort({ createdAt: "desc" }).skip(skip).limit(limitItems);
        for (const item of jobs) {
            const itemFinal = {
                id: item._id,
                title: item.title,
                salaryMin: item.salaryMin,
                salaryMax: item.salaryMax,
                position: item.position,
                workingForm: item.workingForm,
                technologies: item.technologies,
                companyLogo: "",
                companyName: "",
                companyCity: ""
            };
            if (item.companyId) {
                const companyInfo = yield account_company_model_1.default.findOne({ _id: item.companyId });
                if (companyInfo) {
                    itemFinal.companyLogo = companyInfo.logo;
                    itemFinal.companyName = companyInfo.companyName;
                    if (companyInfo.city) {
                        const cityData = yield city_model_1.default.findOne({ _id: companyInfo.city });
                        itemFinal.companyCity = cityData ? cityData.name : "N/A";
                    }
                }
            }
            dataFinal.push(itemFinal);
        }
        res.json({
            code: "success",
            message: "Thành công!",
            jobs: dataFinal,
            totalRecord: totalRecord,
            totalPage: totalPage
        });
    }
    catch (error) {
        console.error("Lỗi Search API:", error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        });
    }
});
exports.search = search;
