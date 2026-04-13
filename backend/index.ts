import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.route";
import  cookieParser  from  "cookie-parser" ;

import { connectDB } from './configs/database.config';

// Load biến môi trường
dotenv.config();

// Kết nối DB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// 1. Cấu hình CORS để cho phép Frontend (3000) gọi API
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true, // Cho phép gửi cookie nếu cần
}));

// 2. Middleware cho phép server đọc dữ liệu JSON từ req.body
app.use(express.json());

app.use(cookieParser());

// 3. Kết nối hệ thống định tuyến (Routes)
app.use("/", routes);

// 4. Khởi động server
app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});