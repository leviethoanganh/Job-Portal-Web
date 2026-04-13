"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// 1. Định nghĩa cấu trúc (Schema) cho City
const citySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true // Thông thường tên thành phố là bắt buộc
    },
    // Bạn có thể thêm các trường khác nếu cần, ví dụ:
    // slug: String,
    // status: String
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});
// 2. Tạo Model kết nối với Collection "cities"
const City = mongoose_1.default.model("City", citySchema, "cities");
exports.default = City;
