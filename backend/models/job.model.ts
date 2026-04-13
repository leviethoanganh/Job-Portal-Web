import mongoose from "mongoose";

// 1. Định nghĩa cấu trúc bảng (Schema) cho công việc (Job)
const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true, // ID công ty là bắt buộc để biết ai đăng bài
    },
    title: {
      type: String,
      required: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    position: {
      type: String, // Ví dụ: Intern, Junior, Senior...
    },
    workingForm: {
      type: String, // Ví dụ: Remote, On-site, Hybrid...
    },
    technologies: {
      type: [String], // Khai báo mảng các chuỗi (Array of Strings)
    },
    description: {
      type: String, // Nội dung HTML từ TinyMCE sẽ lưu ở đây
    },
    images: {
      type: [String], // Mảng chứa URL các hình ảnh dự án/văn phòng
    },
  },
  {
    // Tự động quản lý thời gian tạo (createdAt) và cập nhật (updatedAt)
    timestamps: true,
  }
);

// 2. Tạo Model kết nối với Collection "jobs"
const Job = mongoose.model("Job", jobSchema, "jobs");

export default Job;