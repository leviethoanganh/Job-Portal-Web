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
exports.logout = exports.check = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const account_user_model_1 = __importDefault(require("../models/account-user.model"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const check = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Lấy token từ Cookie mà trình duyệt gửi lên
        const token = req.cookies.token;
        if (!token) {
            console.log("--- [Controller Check] Không có token để kiểm tra ---");
            return res.json({
                code: "error",
                message: "Token không hợp lệ!",
            });
        }
        // 2. Giải mã token bằng Secret Key
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        const { id, email } = decoded;
        // 3. Truy vấn Database để đảm bảo tài khoản vẫn tồn tại
        const existAccountUser = yield account_user_model_1.default.findOne({
            _id: id,
            email: email,
        });
        if (existAccountUser) {
            console.log("--- [Controller Check] Khớp User:", existAccountUser.fullName);
            const infoUser = {
                id: existAccountUser.id,
                fullName: existAccountUser.fullName,
                email: existAccountUser.email,
                avatar: existAccountUser.avatar,
                phone: existAccountUser.phone,
            };
            res.json({
                code: "success",
                message: "Token hợp lệ!",
                infoUser: infoUser,
            });
            return;
        }
        const existAccountCompany = yield account_company_model_1.default.findOne({
            _id: id,
            email: email
        });
        // 2. Trường hợp tìm thấy tài khoản hợp lệ
        if (existAccountCompany) {
            console.log("--- [Controller Check] Khớp Company:", existAccountCompany.companyName);
            const infoCompany = {
                id: existAccountCompany._id,
                companyName: existAccountCompany.companyName,
                email: existAccountCompany.email,
                city: existAccountCompany.city,
                address: existAccountCompany.address,
                companyModel: existAccountCompany.companyModel,
                companyEmployees: existAccountCompany.companyEmployees,
                workingTime: existAccountCompany.workingTime,
                workOvertime: existAccountCompany.workOvertime,
                phone: existAccountCompany.phone,
                description: existAccountCompany.description,
                logo: existAccountCompany.logo,
            };
            // Trả về kết quả thành công
            return res.json({
                code: "success",
                message: "Token hợp lệ!",
                infoCompany: infoCompany
                // Đã xóa infoUser vì không xác định được biến này từ đâu ra
            });
        }
        // 3. Trường hợp không tìm thấy tài khoản (Token giả mạo hoặc user đã bị xóa)
        res.clearCookie("token");
        return res.json({
            code: "error",
            message: "Token không hợp lệ hoặc tài khoản không tồn tại!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Token không hợp lệ!",
        });
    }
});
exports.check = check;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Xóa cookie có tên "token" khỏi trình duyệt của người dùng
    res.clearCookie("token");
    // 2. Phản hồi về Frontend để thực hiện chuyển trang
    res.json({
        code: "success",
        message: "Đã đăng xuất!",
    });
});
exports.logout = logout;
