# 🚀 Job Portal Web

Trang web cổng thông tin tìm kiếm việc làm và tuyển dụng chuyên nghiệp, được xây dựng theo kiến trúc **MERN Stack** kết hợp các công nghệ Front-end tối tân nhất hiện nay.

## 🛠 Công nghệ sử dụng

### Khung giao diện (Frontend - `/frontend`)
- **[Next.js 16.1.6](https://nextjs.org/)**: Framework React tối ưu hóa SEO bằng công nghệ SSR (Server-Side Rendering). Hỗ trợ biên dịch siêu tốc với cơ chế **Turbopack**.
- **[React 19](https://react.dev/)**: Thư viện lõi quản lý trạng thái động.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Nền tảng thiết kế giao diện linh hoạt, giúp tốc độ triển khai UI nhanh, đồng bộ, đặc biệt ở các trang Detail và List việc làm.

### Máy chủ Dữ liệu (Backend - `/backend`)
- **[Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/)**: Vận hành và điều hướng luồng API RESTful.
- **[MongoDB](https://www.mongodb.com/)** kết hợp **Mongoose**: Quản lý cơ sở dữ liệu định dạng JSON (Jobs, CVs, Accounts).
- **TypeScript**: Ép kiểu dữ liệu nghiêm ngặt, giảm thiểu lỗi đánh máy phát sinh quá trình gọi API.
- **JWT (JSON Web Token)**: Cấp quyền, chia mẻ truy cập (Tách biệt quyền ứng viên User - Nhà tuyển dụng Company).
- **[Cloudinary](https://cloudinary.com/)**: Lưu trữ trực tiếp file Ảnh bìa, Logo, và Hồ sơ CV (PDF) lên môi trường Cloud.

---

## 📂 Kiến trúc dự án
Dự án được phân chia rành mạch thành hai nửa độc lập để dễ dàng triển khai (Deploy) theo chuẩn cấu hình Monorepo lai:

* **`/frontend`**: Giao diện ứng dụng người dùng cuối và các công ty tương tác. (Triển khai dễ nhất qua **Vercel**).
* **`/backend`**: Máy chủ cung cấp dữ liệu, API điều khiển toàn bộ logic xoay quanh công việc tìm kiếm và lọc. (Triển khai dễ nhất thông qua **Render**).

---

## ⚙️ Hướng dẫn Khởi chạy (Local Development)

### 1. Backend (Khởi động Server API)
Bạn cần thiết lập các biến môi trường trong file `.env` (Port, Chuỗi kết nối MongoDB, API Key của Cloudinary...).  
Dịch chuyển vào thư mục và khởi chạy:
```bash
cd backend
npm install
npm start
```

### 2. Frontend (Khởi động Giao diện Cổng việc làm)
Mở một cửa sổ Terminal mới, cấu hình đường dẫn `NEXT_PUBLIC_API_URL` trỏ vào thẻ gốc của backend (ví dụ: `http://localhost:5000`) qua tệp `.env.local`.  
Sau đó gõ:
```bash
cd frontend
yarn install   # Hoặc dùng npm install
yarn dev       # Cổng mặc định sẽ chạy ở localhost:3000
```
