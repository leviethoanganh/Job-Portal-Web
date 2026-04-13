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
exports.loginPost = exports.registerPost = void 0;
const joi_1 = __importDefault(require("joi"));
const registerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Định nghĩa cấu trúc kiểm tra dữ liệu (Schema)
    const schema = joi_1.default.object({
        fullName: joi_1.default.string()
            .min(5)
            .max(50)
            .required()
            .messages({
            "string.empty": "Vui lòng nhập họ tên!",
            "string.min": "Vui lòng nhập ít nhất 5 ký tự!",
            "string.max": "Vui lòng nhập tối đa 50 ký tự!",
            "any.required": "Vui lòng nhập họ tên!",
        }),
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
            "any.required": "Vui lòng nhập email!",
        }),
        password: joi_1.default.string()
            .min(8)
            .required()
            .custom((value, helpers) => {
            // Kiểm tra các ràng buộc mật khẩu tương tự như JustValidate ở Frontend
            if (!/[a-z]/.test(value))
                return helpers.error("password.lowercase");
            if (!/[A-Z]/.test(value))
                return helpers.error("password.uppercase");
            if (!/\d/.test(value))
                return helpers.error("password.number");
            if (!/[^A-Za-z0-9]/.test(value))
                return helpers.error("password.special");
            return value;
        })
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "string.min": "Mật khẩu phải có nhất 8 ký tự!",
            "password.lowercase": "Mật khẩu phải chứa ký tự thường!",
            "password.uppercase": "Mật khẩu phải chứa ký tự hoa!",
            "password.number": "Mật khẩu phải chứa chữ số!",
            "password.special": "Mật khẩu phải chứa ký tự đặc biệt!",
            "any.required": "Vui lòng nhập mật khẩu!",
        }),
    });
    // 2. Thực hiện kiểm tra req.body
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
            code: "error",
            message: errorMessage,
        });
    }
    // 3. Nếu không có lỗi, chuyển tiếp sang Controller xử lý tiếp
    next();
});
exports.registerPost = registerPost;
const loginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Định nghĩa Schema kiểm tra dữ liệu đăng nhập
    const schema = joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            "string.empty": "Vui lòng nhập email!",
            "string.email": "Email không đúng định dạng!",
            "any.required": "Vui lòng nhập email!",
        }),
        password: joi_1.default.string()
            .required()
            .messages({
            "string.empty": "Vui lòng nhập mật khẩu!",
            "any.required": "Vui lòng nhập mật khẩu!",
        }),
    });
    // 2. Thực hiện kiểm tra dữ liệu trong req.body
    const { error } = schema.validate(req.body);
    if (error) {
        const errorMessage = error.details[0].message;
        return res.json({
            code: "error",
            message: errorMessage,
        });
    }
    // 3. Nếu dữ liệu hợp lệ, gọi next() để chuyển sang Controller xử lý login
    next();
});
exports.loginPost = loginPost;
