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
exports.verifyTokenCompany = exports.verifyTokenUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_user_model_1 = __importDefault(require("../models/account-user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const verifyTokenUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log("--- [Middleware] Không tìm thấy Token ---");
            return res.json({ code: "error", message: "Vui lòng đăng nhập!" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        // THAY ĐỔI: Ép kiểu ID về ObjectId để tìm kiếm chính xác
        const existAccount = yield account_user_model_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(decoded.id),
            // deleted: false  // Lưu ý: Nếu Schema của bạn chưa có trường deleted, hãy comment dòng này lại
        });
        if (!existAccount) {
            console.log(`--- [Middleware] XÓA COOKIE: ID ${decoded.id} không tồn tại trong DB ---`);
            res.clearCookie("token");
            return res.json({ code: "error", message: "Tài khoản không tồn tại!" });
        }
        console.log("--- [Middleware] Xác thực thành công cho:", existAccount.fullName);
        req.account = existAccount;
        next();
    }
    catch (error) {
        console.log("--- [Middleware] XÓA COOKIE: Token lỗi ---", error.message);
        res.clearCookie("token");
        return res.json({ code: "error", message: "Token không hợp lệ!" });
    }
});
exports.verifyTokenUser = verifyTokenUser;
const verifyTokenCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.json({
                code: "error",
                message: "Vui lòng gửi kèm theo token!"
            });
            return;
        }
        // Giải mã token
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        const { id, email } = decoded;
        const existAccount = yield account_company_model_1.default.findOne({
            _id: id,
            email: email
        });
        if (!existAccount) {
            res.clearCookie("token");
            res.json({
                code: "error",
                message: "Token không hợp lệ!"
            });
            return;
        }
        req.account = existAccount;
        next();
    }
    catch (error) {
        res.clearCookie("token");
        res.json({
            code: "error",
            message: error
        });
    }
});
exports.verifyTokenCompany = verifyTokenCompany;
