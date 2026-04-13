"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// 1. Định nghĩa cấu trúc bảng (Schema) cho người dùng
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: String,
    phone: String
}, {
    // Tự động sinh ra trường createdAt và updatedAt
    timestamps: true,
});
// 2. Tạo Model để tương tác với Collection "accounts-user" trong DB
const AccountUser = mongoose_1.default.model("AccountUser", userSchema, "accounts-user");
exports.default = AccountUser;
