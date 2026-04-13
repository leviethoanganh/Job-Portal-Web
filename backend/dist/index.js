"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const database_config_1 = require("./configs/database.config");
// Load biến môi trường
dotenv_1.default.config();
// Kết nối DB
(0, database_config_1.connectDB)();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// 1. Cấu hình CORS để cho phép Frontend (3000) gọi API
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true, // Cho phép gửi cookie nếu cần
}));
// 2. Middleware cho phép server đọc dữ liệu JSON từ req.body
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// 3. Kết nối hệ thống định tuyến (Routes)
app.use("/", index_route_1.default);
// 4. Khởi động server
app.listen(port, () => {
    console.log(`Website đang chạy trên cổng ${port}`);
});
