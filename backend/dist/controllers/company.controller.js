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
exports.top = exports.deleteCVDel = exports.changeStatusCVPatch = exports.detailCV = exports.listCV = exports.detail = exports.list = exports.deleteJobDel = exports.editJobPatch = exports.editJob = exports.listJob = exports.createJobPost = exports.profilePatch = exports.loginPost = exports.registerPost = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const account_company_model_1 = __importDefault(require("../models/account-company.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const job_model_1 = __importDefault(require("../models/job.model"));
const city_model_1 = __importDefault(require("../models/city.model"));
const cv_model_1 = __importDefault(require("../models/cv.model"));
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Nhận dữ liệu từ body của yêu cầu
        const { companyName, email, password } = req.body;
        // 2. Kiểm tra xem Email công ty đã tồn tại chưa
        const existAccount = yield account_company_model_1.default.findOne({
            email: email,
        });
        if (existAccount) {
            return res.json({
                code: "error",
                message: "Email đã tồn tại trong hệ thống!",
            });
        }
        // 3. Mã hóa mật khẩu bảo mật cho doanh nghiệp
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(password, salt);
        // 4. Tạo bản ghi mới sử dụng Model AccountCompany
        const newAccount = new account_company_model_1.default({
            companyName: companyName,
            email: email,
            password: hash,
        });
        // 5. Lưu vào MongoDB
        yield newAccount.save();
        // 6. Trả về phản hồi thành công
        res.json({
            code: "success",
            message: "Đăng ký tài khoản thành công!",
        });
    }
    catch (error) {
        console.error(error);
        res.json({
            code: "error",
            message: "Đã có lỗi xảy ra, vui lòng thử lại sau!",
        });
    }
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Kiểm tra email
    const existAccount = yield account_company_model_1.default.findOne({
        email: email
    });
    if (!existAccount) {
        res.json({
            code: "error",
            message: "Email không tồn tại trong hệ thống!"
        });
        return;
    }
    // Kiểm tra mật khẩu
    const isPasswordValid = yield bcryptjs_1.default.compare(password, `${existAccount.password}`);
    if (!isPasswordValid) {
        res.json({
            code: "error",
            message: "Mật khẩu không đúng!"
        });
        return;
    }
    // Tạo JWT
    const token = jsonwebtoken_1.default.sign({
        id: existAccount._id,
        email: existAccount.email,
    }, `${process.env.JWT_SECRET}`, {
        expiresIn: "1d"
    });
    console.log("Email đăng nhập:", email);
    console.log("Token JWT đã tạo:", token);
    // Lưu token vào cookie
    res.cookie("token", token, {
        maxAge: (24 * 60 * 60 * 1000), // 1 ngày
        httpOnly: true, // Chỉ cho phép cookie được truy cập bởi server
        sameSite: "lax", // Cho phép lấy được cookie từ tên miền khác
        secure: false, // process.env.NODE_ENV === "production", // http: false, https: true
    });
    return res.json({
        code: "success",
        message: "Đăng nhập thành công!"
    });
});
exports.loginPost = loginPost;
const profilePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            req.body.logo = req.file.path;
        }
        else {
            delete req.body.logo;
        }
        yield account_company_model_1.default.updateOne({
            _id: req.account.id
        }, req.body);
        res.json({
            code: "success",
            message: "Cập nhật thành công!"
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: "error",
            message: "Cập nhật không thành công!"
        });
    }
});
exports.profilePatch = profilePatch;
const createJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Gán ID công ty từ token (đã qua middleware xác thực)
        req.body.companyId = req.account.id;
        // 2. Ép kiểu dữ liệu lương sang số (Number)
        req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
        req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
        // 3. Chuyển chuỗi công nghệ "React, Node" thành mảng ["React", "Node"]
        if (req.body.technologies) {
            req.body.technologies = req.body.technologies
                .split(",")
                .map((item) => item.trim()); // Xóa khoảng trắng thừa
        }
        else {
            req.body.technologies = [];
        }
        // 4. Xử lý danh sách ảnh từ Multer (upload.array)
        req.body.images = [];
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                // Đẩy URL từ Cloudinary (file.path) vào mảng images
                req.body.images.push(file.path);
            }
        }
        // 5. Lưu vào Database
        const newRecord = new job_model_1.default(req.body);
        yield newRecord.save();
        res.json({
            code: "success",
            message: "Tạo công việc thành công!",
        });
    }
    catch (error) {
        console.error("Lỗi tạo công việc:", error);
        res.json({
            code: "error",
            message: "Dữ liệu không hợp lệ hoặc có lỗi hệ thống!",
        });
    }
});
exports.createJobPost = createJobPost;
const listJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Tạo đối tượng tìm kiếm (lọc theo ID công ty)
        const find = {
            companyId: req.account.id,
        };
        // --- PHẦN PHÂN TRANG ---
        const limitItems = 6; // Số lượng công việc hiển thị trên mỗi trang
        let page = 1; // Mặc định là trang 1
        // Nếu trên URL có truyền ?page=... thì lấy giá trị đó
        if (req.query.page) {
            page = parseInt(req.query.page.toString());
        }
        // Tính tổng số bản ghi thỏa mãn điều kiện 'find'
        const totalRecord = yield job_model_1.default.countDocuments(find);
        // Tính tổng số trang (Ví dụ: 5 bản ghi / 2 mỗi trang = 2.5 -> làm tròn lên là 3 trang)
        const totalPage = Math.ceil(totalRecord / limitItems);
        // Tính số lượng bản ghi cần bỏ qua (skip)
        // Trang 1: skip = (1-1) * 2 = 0
        // Trang 2: skip = (2-1) * 2 = 2
        const skip = (page - 1) * limitItems;
        // --- HẾT PHẦN PHÂN TRANG ---
        // 2. Truy vấn dữ liệu từ Database
        const jobs = yield job_model_1.default.find(find)
            .sort({ createdAt: "desc" }) // Sắp xếp việc mới nhất lên đầu (desc = descending)
            .limit(limitItems) // Giới hạn số lượng lấy ra
            .skip(skip); // Bỏ qua các bản ghi của các trang trước
        // 3. Chuẩn hóa dữ liệu trả về cho Frontend
        const dataFinal = jobs.map((item) => ({
            id: item.id,
            title: item.title,
            salaryMin: item.salaryMin,
            salaryMax: item.salaryMax,
            position: item.position,
            workingForm: item.workingForm,
            technologies: item.technologies,
        }));
        // 4. Trả về kết quả kèm theo thông tin phân trang
        res.json({
            code: "success",
            message: "Lấy danh sách công việc thành công!",
            jobs: dataFinal,
            totalPage: totalPage, // Frontend sẽ dùng cái này để vẽ số lượng option trong thẻ select
        });
    }
    catch (error) {
        console.error(error);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra khi lấy dữ liệu!",
        });
    }
});
exports.listJob = listJob;
// [GET] Lấy dữ liệu chi tiết để sửa
const editJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Tìm Job theo ID và phải thuộc về Công ty đang đăng nhập (bảo mật)
        const jobDetail = yield job_model_1.default.findOne({
            _id: id,
            companyId: req.account.id
        });
        if (jobDetail) {
            res.json({
                code: "success",
                message: "Thành công!",
                jobDetail: jobDetail
            });
        }
        else {
            res.json({
                code: "error",
                message: "Công việc không tồn tại hoặc bạn không có quyền truy cập!"
            });
        }
    }
    catch (error) {
        res.json({
            code: "error",
            message: "ID không hợp lệ!"
        });
    }
});
exports.editJob = editJob;
// [PATCH] Cập nhật dữ liệu mới
const editJobPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // 1. Kiểm tra quyền sở hữu trước khi cho phép sửa
        const jobDetail = yield job_model_1.default.findOne({
            _id: id,
            companyId: req.account.id
        });
        if (!jobDetail) {
            return res.json({
                code: "error",
                message: "Id không hợp lệ!"
            });
        }
        // 2. Chuẩn hóa dữ liệu (Sửa lỗi bodysuit -> body)
        req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
        req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
        // Chuyển chuỗi công nghệ thành mảng
        if (req.body.technologies) {
            req.body.technologies = req.body.technologies.split(",").map((t) => t.trim());
        }
        // 3. Xử lý logic ẢNH (Quan trọng)
        // - Nếu req.body.images gửi lên là string (1 ảnh cũ) hoặc array (nhiều ảnh cũ)
        let imagesFinal = [];
        if (req.body.images) {
            if (Array.isArray(req.body.images)) {
                imagesFinal = [...req.body.images];
            }
            else {
                imagesFinal.push(req.body.images);
            }
        }
        // - Thêm ảnh mới vừa upload từ Multer (nếu có)
        if (req.files && Array.isArray(req.files)) {
            for (const file of req.files) {
                imagesFinal.push(file.path); // path là URL từ Cloudinary
            }
        }
        req.body.images = imagesFinal;
        // 4. Cập nhật vào Database
        yield job_model_1.default.updateOne({
            _id: id,
            companyId: req.account.id
        }, req.body);
        res.json({
            code: "success",
            message: "Cập nhật thành công!"
        });
    }
    catch (error) {
        console.error(error);
        res.json({
            code: "error",
            message: "Đã có lỗi xảy ra khi cập nhật!"
        });
    }
});
exports.editJobPatch = editJobPatch;
const deleteJobDel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Thực hiện xóa trực tiếp với điều kiện kép (ID + Chủ sở hữu)
        const result = yield job_model_1.default.deleteOne({
            _id: id,
            companyId: req.account.id
        });
        // result.deletedCount sẽ bằng 1 nếu xóa thành công, bằng 0 nếu không tìm thấy
        if (result.deletedCount > 0) {
            return res.json({
                code: "success",
                message: "Đã xóa công việc thành công!"
            });
        }
        else {
            return res.json({
                code: "error",
                message: "Không tìm thấy công việc hoặc bạn không có quyền xóa!"
            });
        }
    }
    catch (error) {
        return res.json({
            code: "error",
            message: "ID không hợp lệ hoặc lỗi hệ thống!"
        });
    }
});
exports.deleteJobDel = deleteJobDel;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Xử lý giới hạn số lượng bản ghi (Pagination cơ bản)
        const find = {};
        let limitItems = 6;
        if (req.query.limitItems) {
            limitItems = parseInt(`${req.query.limitItems}`);
        }
        let page = 1;
        if (req.query.page) {
            // Parsing to int and ensuring it's at least 1
            page = Math.max(1, parseInt(`${req.query.page}`));
        }
        const totalRecord = yield account_company_model_1.default.countDocuments(find);
        const totalPage = Math.ceil(totalRecord / limitItems);
        const skip = (page - 1) * limitItems;
        // 2. Lấy danh sách tài khoản công ty từ Database
        const companyList = yield account_company_model_1.default
            .find(find) // Use the 'find' object defined earlier in your logic
            .sort({
            createdAt: "desc" // Sort by newest first
        })
            .limit(limitItems) // Limit to the number of items per page (e.g., 2)
            .skip(skip); // Skip the items from previous pages
        const companyListFinal = [];
        // 3. Duyệt qua từng công ty để lấy thêm thông tin liên quan
        for (const item of companyList) {
            const dataItemFinal = {
                id: item.id,
                logo: item.logo,
                companyName: item.companyName,
                cityName: "",
                totalJob: 0
            };
            // Lấy tên Thành phố từ Model City dựa trên ID lưu trong công ty
            const city = yield city_model_1.default.findOne({
                _id: item.city
            });
            dataItemFinal.cityName = city ? city.name : "N/A";
            // Đếm tổng số lượng Job mà công ty này đã đăng
            const totalJob = yield job_model_1.default.countDocuments({
                companyId: item.id
            });
            dataItemFinal.totalJob = totalJob;
            // Thêm dữ liệu đã làm sạch vào mảng kết quả
            companyListFinal.push(dataItemFinal);
        }
        // 4. Trả về phản hồi cho Frontend
        res.json({
            code: "success",
            message: "Lấy danh sách công ty thành công!",
            companyList: companyListFinal,
            totalPage: totalPage
        });
    }
    catch (error) {
        console.error("Lỗi lấy danh sách công ty:", error);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra phía máy chủ!"
        });
    }
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // 1. Find the Company
        const record = yield account_company_model_1.default.findOne({ _id: id });
        if (record) {
            const companyDetail = {
                id: record.id,
                logo: record.logo,
                companyName: record.companyName,
                address: record.address,
                companyModel: record.companyModel,
                companyEmployees: record.companyEmployees,
                workingTime: record.workingTime,
                workOvertime: record.workOvertime,
                description: record.description
            };
            // 2. Find Jobs related to this Company
            const jobs = yield job_model_1.default.find({ companyId: id })
                .sort({ createdAt: "desc" }); // Fixed .spell to .sort
            // 3. Get City Name (Optimized: Get it once before the loop)
            const cityRecord = yield city_model_1.default.findOne({ _id: record.city });
            const cityName = (cityRecord === null || cityRecord === void 0 ? void 0 : cityRecord.name) || "";
            // 4. Format the Jobs list for the frontend
            const dataFinal = jobs.map((item) => ({
                id: item.id,
                companyLogo: record.logo,
                title: item.title,
                companyName: record.companyName,
                salaryMin: item.salaryMin,
                salaryMax: item.salaryMax,
                position: item.position,
                workingForm: item.workingForm,
                companyCity: cityName,
                technologies: item.technologies
            }));
            res.json({
                code: "success",
                message: "Thành công!",
                companyDetail: companyDetail,
                jobs: dataFinal
            });
        }
        else {
            res.json({
                code: "error",
                message: "Không tìm thấy công ty!"
            });
        }
    }
    catch (error) {
        console.error(error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống!"
        });
    }
});
exports.detail = detail;
const listCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        // 1. Get all Job IDs and their details for this company
        const listJob = yield job_model_1.default.find({
            companyId: companyId
        });
        if (!listJob || listJob.length === 0) {
            return res.json({
                code: "success",
                message: "Công ty chưa có bài đăng tuyển dụng nào.",
                listCV: []
            });
        }
        const listJobId = listJob.map(item => item.id);
        // 2. Get all CVs that match those Job IDs
        const listCVRaw = yield cv_model_1.default.find({
            jobId: { $in: listJobId }
        }).sort({ createdAt: "desc" }); // Fixed .spell to .sort
        // 3. Map the data efficiently
        // We use the already fetched 'listJob' to find info without hitting the DB again
        const dataFinal = listCVRaw.map(cv => {
            const infoJob = listJob.find(job => job.id === cv.jobId);
            return {
                id: cv.id,
                fullName: cv.fullName,
                email: cv.email,
                phone: cv.phone,
                fileCV: cv.fileCV, // <-- Add this line to return the CV file link
                viewed: cv.viewed,
                status: cv.status,
                jobTitle: (infoJob === null || infoJob === void 0 ? void 0 : infoJob.title) || "",
                jobSalaryMin: (infoJob === null || infoJob === void 0 ? void 0 : infoJob.salaryMin) ? parseInt(infoJob.salaryMin.toString()) : 0,
                jobSalaryMax: (infoJob === null || infoJob === void 0 ? void 0 : infoJob.salaryMax) ? parseInt(infoJob.salaryMax.toString()) : 0,
                jobPosition: (infoJob === null || infoJob === void 0 ? void 0 : infoJob.position) || "",
                jobWorkingForm: (infoJob === null || infoJob === void 0 ? void 0 : infoJob.workingForm) || ""
            };
        });
        res.json({
            code: "success",
            message: "Lấy danh sách CV thành công!",
            listCV: dataFinal
        });
    }
    catch (error) {
        console.error("Error fetching CV list:", error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống khi lấy danh sách CV."
        });
    }
});
exports.listCV = listCV;
const detailCV = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        const cvId = req.params.id;
        // 1. Tìm thông tin CV theo ID
        const infoCV = yield cv_model_1.default.findOne({
            _id: cvId
        });
        if (!infoCV) {
            return res.json({
                code: "error",
                message: "Không tìm thấy hồ sơ ứng tuyển!"
            });
        }
        // 2. Tìm thông tin công việc và xác thực quyền sở hữu của công ty
        // Điều này cực kỳ quan trọng để bảo mật dữ liệu
        const infoJob = yield job_model_1.default.findOne({
            _id: infoCV.jobId,
            companyId: companyId
        });
        if (!infoJob) {
            return res.json({
                code: "error",
                message: "Bạn không có quyền truy cập hồ sơ này!"
            });
        }
        // 3. Chuẩn bị dữ liệu gửi về Frontend
        const dataFinalCV = {
            id: infoCV.id,
            fullName: infoCV.fullName,
            email: infoCV.email,
            phone: infoCV.phone,
            fileCV: infoCV.fileCV,
            status: infoCV.status
        };
        const dataFinalJob = {
            id: infoJob.id,
            title: infoJob.title,
            salaryMin: infoJob.salaryMin,
            salaryMax: infoJob.salaryMax,
            position: infoJob.position,
            workingForm: infoJob.workingForm,
            technologies: infoJob.technologies,
        };
        // 4. Cập nhật trạng thái "Đã xem" nếu đây là lần đầu mở CV
        if (!infoCV.viewed) {
            yield cv_model_1.default.updateOne({ _id: cvId }, { $set: { viewed: true } });
        }
        res.json({
            code: "success",
            message: "Lấy chi tiết CV thành công!",
            infoCV: dataFinalCV,
            infoJob: dataFinalJob
        });
    }
    catch (error) {
        console.error("Error in detailCV:", error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống, vui lòng thử lại sau!"
        });
    }
});
exports.detailCV = detailCV;
const changeStatusCVPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        // Fixed: changed 'bodysuit' to 'body'
        const cvId = req.body.id;
        const status = req.body.status;
        // 1. Find the CV
        const infoCV = yield cv_model_1.default.findOne({
            _id: cvId
        });
        if (!infoCV) {
            return res.json({
                code: "error",
                message: "Không tìm thấy hồ sơ ứng tuyển!"
            });
        }
        // 2. Security Check: Ensure this CV belongs to a job posted by THIS company
        const infoJob = yield job_model_1.default.findOne({
            _id: infoCV.jobId,
            companyId: companyId
        });
        if (!infoJob) {
            return res.json({
                code: "error",
                message: "Bạn không có quyền thay đổi trạng thái hồ sơ này!"
            });
        }
        // 3. Update the status
        yield cv_model_1.default.updateOne({ _id: cvId }, {
            $set: { status: status }
        });
        res.json({
            code: "success",
            message: "Cập nhật trạng thái thành công!"
        });
    }
    catch (error) {
        console.error("Update Status Error:", error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống, vui lòng thử lại sau!"
        });
    }
});
exports.changeStatusCVPatch = changeStatusCVPatch;
const deleteCVDel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = req.account.id;
        const cvId = req.params.id;
        // 1. Tìm CV để lấy jobId
        const infoCV = yield cv_model_1.default.findOne({
            _id: cvId
        });
        if (!infoCV) {
            return res.json({
                code: "error",
                message: "Không tìm thấy CV!"
            });
        }
        // 2. Kiểm tra xem Job của CV này có thuộc về công ty đang đăng nhập không
        const infoJob = yield job_model_1.default.findOne({
            _id: infoCV.jobId,
            companyId: companyId
        });
        if (!infoJob) {
            return res.json({
                code: "error",
                message: "Bạn không có quyền xóa CV này!"
            });
        }
        // 3. Thực hiện xóa vĩnh viễn khỏi Database
        yield cv_model_1.default.deleteOne({
            _id: cvId
        });
        res.json({
            code: "success",
            message: "Đã xóa CV thành công!"
        });
    }
    catch (error) {
        console.error("Delete CV Error:", error);
        res.json({
            code: "error",
            message: "Lỗi hệ thống, không thể xóa CV!"
        });
    }
});
exports.deleteCVDel = deleteCVDel;
const top = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Group jobs by companyId, count them, sort by count descending, limit to 3
        const topCompanyIds = yield job_model_1.default.aggregate([
            { $group: { _id: "$companyId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 }
        ]);
        const result = [];
        // 2. Fetch company details for each of the top company IDs
        for (const item of topCompanyIds) {
            const company = yield account_company_model_1.default.findOne({ _id: item._id });
            if (company) {
                result.push({
                    id: company.id,
                    companyName: company.companyName,
                    totalJob: item.count
                });
            }
        }
        res.json({
            code: "success",
            message: "Lấy danh sách top công ty thành công!",
            companyList: result
        });
    }
    catch (error) {
        console.error("Lỗi lấy top công ty:", error);
        res.json({
            code: "error",
            message: "Có lỗi xảy ra phía máy chủ!"
        });
    }
});
exports.top = top;
