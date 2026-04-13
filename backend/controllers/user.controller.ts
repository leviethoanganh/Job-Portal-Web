import { Request, Response } from "express";
import AccountUser from "../models/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AccountRequest } from "../interfaces/request.interface";
import CV from "../models/cv.model";
import Job from "../models/job.model";
import AccountCompany from "../models/account-company.model";


export const registerPost = async (req: AccountRequest, res: Response) => {
  try {
    // 1. Lấy dữ liệu từ body của yêu cầu
    const { fullName, email, password } = req.body;
    console.log("Dữ liệu nhận được từ Frontend:", { fullName, email, password });

    // 2. Kiểm tra xem Email đã tồn tại trong Database chưa
    const existAccount = await AccountUser.findOne({
      email: email,
    });

    if (existAccount) {
      return res.json({
        code: "error",
        message: "Email đã tồn tại trong hệ thống!",
      });
    }

    // 3. Mã hóa mật khẩu trước khi lưu để bảo mật
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Tạo bản ghi mới sử dụng Model AccountUser
    const newAccount = new AccountUser({
      fullName: fullName,
      email: email,
      password: passwordHash,
      avatar: "",
      phone: "",
    });

    // 5. Lưu vào MongoDB
    await newAccount.save();

    // 6. Phản hồi về Frontend
    res.json({
      code: "success",
      message: "Đăng ký tài khoản thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

export const loginPost = async (req: Request, res: Response) => {
  try {
    // 1. Nhận dữ liệu từ body
    const { email, password } = req.body;

    // 2. Kiểm tra sự tồn tại của tài khoản
    const existAccount = await AccountUser.findOne({ email: email });

    if (!existAccount) {
      return res.json({
        code: "error",
        message: "Email không tồn tại trong hệ thống!",
      });
    }

    // 3. So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
    const isPasswordValid = await bcrypt.compare(password, existAccount.password);

    if (!isPasswordValid) {
      return res.json({
        code: "error",
        message: "Mật khẩu không đúng!",
      });
    }

    // 4. Tạo JWT token để định danh người dùng
    const token = jwt.sign(
      {
        id: existAccount._id,
        email: existAccount.email,
      },
      `${process.env.JWT_SECRET}`, // Sử dụng biến môi trường JWT_SECRET
      {
        expiresIn: "1d", // Token có hiệu lực trong 1 ngày
      }
    );

    // 5. Lưu token vào HttpOnly Cookie để tăng cường bảo mật
    res.cookie("token", token, {
      path: "/", 
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: true, 
      sameSite: "none", 
      secure: true, 
    });

    // 6. Trả về phản hồi thành công
    res.json({
      code: "success",
      message: "Đăng nhập thành công!",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
    });
  }
};

export const profilePatch = async (req: AccountRequest, res: Response) => {
  try {
    // 1. Xử lý file ảnh (nếu người dùng có upload ảnh mới qua Cloudinary)
    if (req.file) {
      // req.file.path chứa URL ảnh sau khi upload lên Cloudinary thành công
      req.body.avatar = req.file.path;
    } else {
      // Nếu không gửi file, xóa thuộc tính avatar khỏi body để tránh ghi đè dữ liệu cũ bằng null
      delete req.body.avatar;
    }

    // 2. Cập nhật vào Database dựa trên ID người dùng lấy từ Middleware (req.account)
    await AccountUser.updateOne(
      {
        _id: req.account._id // Dùng _id cho chuẩn xác
      },
      req.body // Cập nhật các trường gửi lên từ form (fullName, phone, email, avatar...)
    );

    // 3. Phản hồi thành công
    return res.json({
      code: "success",
      message: "Cập nhật thành công!"
    });

  } catch (error) {
    console.error("Lỗi Profile Patch:", error);
    return res.json({
      code: "error",
      message: "Cập nhật không thành công!"
    });
  }
}

export const listCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;

    const listCV = await CV.find({
      email: userEmail
    }).sort({ // Fixed .spell to .sort
      createdAt: "desc"
    });

    const dataFinal = [];

    for (const item of listCV) {
      const dataItemFinal = {
        id: item.id,
        jobTitle: "",
        companyName: "",
        jobSalaryMin: 0,
        jobSalaryMax: 0,
        jobPosition: "",
        jobWorkingForm: "",
        status: item.status
      };

      const infoJob = await Job.findOne({
        _id: item.jobId
      });

      if (infoJob) {
        dataItemFinal.jobTitle = `${infoJob.title}`;
        dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
        dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
        dataItemFinal.jobPosition = `${infoJob.position}`; // Fixed template literal space error
        dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

        const infoCompany = await AccountCompany.findOne({
          _id: infoJob.companyId
        });

        if (infoCompany) {
          dataItemFinal.companyName = `${infoCompany.companyName}`;
          dataFinal.push(dataItemFinal);
        }
      }
    }

    res.json({
      code: "success",
      message: "Lấy danh sách CV thành công!",
      listCV: dataFinal
    });

  } catch (error) {
    res.json({
      code: "error",
      message: "Thất bại!"
    });
  }
};

export const detailCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;
    const cvId = req.params.id;

    // 1. Phải bắt buộc có email của chính user đang đăng nhập để bảo mật
    const infoCV = await CV.findOne({
      _id: cvId,
      email: userEmail
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Không tìm thấy hồ sơ ứng tuyển hoặc bạn không có quyền truy cập!"
      });
    }

    const infoJob = await Job.findOne({
      _id: infoCV.jobId
    });

    const dataFinalCV = {
      id: infoCV.id,
      fullName: infoCV.fullName,
      email: infoCV.email,
      phone: infoCV.phone,
      fileCV: infoCV.fileCV, // Cloudinary file
      status: infoCV.status
    };

    let dataFinalJob: any = null;
    if (infoJob) {
      dataFinalJob = {
        id: infoJob.id,
        title: infoJob.title,
        salaryMin: infoJob.salaryMin,
        salaryMax: infoJob.salaryMax,
        position: infoJob.position,
        workingForm: infoJob.workingForm,
        technologies: infoJob.technologies,
      };
      
      // Get company Name
      const infoCompany = await AccountCompany.findOne({ _id: infoJob.companyId });
      if (infoCompany) {
        dataFinalJob.companyName = infoCompany.companyName;
      }
    }

    res.json({
      code: "success",
      message: "Thành công!",
      infoCV: dataFinalCV,
      infoJob: dataFinalJob
    });

  } catch (error) {
    console.error("Detail CV Error:", error);
    res.json({
      code: "error",
      message: "Lỗi hệ thống, vui lòng thử lại sau!"
    });
  }
};

export const deleteCV = async (req: AccountRequest, res: Response) => {
  try {
    const userEmail = req.account.email;
    const cvId = req.params.id;

    const infoCV = await CV.findOne({
      _id: cvId,
      email: userEmail
    });

    if (!infoCV) {
      return res.json({
        code: "error",
        message: "Không tìm thấy hồ sơ ứng tuyển hoặc bạn không có quyền xóa!"
      });
    }

    await CV.deleteOne({
      _id: cvId,
      email: userEmail // Bảo mật
    });

    res.json({
      code: "success",
      message: "Đã hủy bỏ hồ sơ ứng tuyển thành công!"
    });

  } catch (error) {
    console.error("Delete CV Error:", error);
    res.json({
      code: "error",
      message: "Lỗi hệ thống, vui lòng thử lại sau!"
    });
  }
};