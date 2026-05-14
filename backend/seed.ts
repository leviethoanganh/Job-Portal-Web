import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// ─── Models ────────────────────────────────────────────────────────────────

const citySchema = new mongoose.Schema({ name: { type: String, required: true } }, { timestamps: true });
const City = mongoose.model("City", citySchema, "cities");

const companySchema = new mongoose.Schema(
  {
    companyName: String, email: { type: String, unique: true }, password: String,
    logo: String, city: String, address: String, companyModel: String,
    companyEmployees: String, workingTime: String, workOvertime: String, phone: String, description: String,
  },
  { timestamps: true }
);
const AccountCompany = mongoose.model("AccountCompany", companySchema, "accounts-company");

const jobSchema = new mongoose.Schema(
  {
    companyId: String, title: String,
    salaryMin: { type: Number, default: 0 }, salaryMax: { type: Number, default: 0 },
    position: String, workingForm: String, technologies: [String], description: String, images: [String],
  },
  { timestamps: true }
);
const Job = mongoose.model("Job", jobSchema, "jobs");

// ─── Seed Data ──────────────────────────────────────────────────────────────

const CITIES = ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh"];

const COMPANIES = [
  {
    companyName: "FPT Software",
    email: "fpt@company.com",
    city: "Hà Nội",
    address: "Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội",
    companyModel: "Product & Outsource",
    companyEmployees: "10.000+",
    workingTime: "Thứ 2 - Thứ 6 (8:00 - 17:30)",
    workOvertime: "Có OT (có phụ cấp)",
    phone: "024 7300 7300",
    description: "<p>FPT Software là công ty thành viên của Tập đoàn FPT, chuyên cung cấp các giải pháp và dịch vụ phần mềm cho khách hàng trong và ngoài nước. Với hơn 25 năm kinh nghiệm, FPT Software tự hào là đối tác tin cậy của hàng trăm doanh nghiệp lớn trên toàn cầu.</p>",
  },
  {
    companyName: "VNG Corporation",
    email: "vng@company.com",
    city: "Hồ Chí Minh",
    address: "Số 182 Lê Đại Hành, Phường 15, Quận 11, TP.HCM",
    companyModel: "Product",
    companyEmployees: "4.000+",
    workingTime: "Thứ 2 - Thứ 6 (8:30 - 18:00)",
    workOvertime: "Linh hoạt",
    phone: "028 7100 9999",
    description: "<p>VNG là tập đoàn công nghệ hàng đầu Việt Nam, nổi tiếng với các sản phẩm như Zalo, Zing MP3, ZaloPay. Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ để cùng xây dựng những sản phẩm mang tầm khu vực.</p>",
  },
  {
    companyName: "KMS Technology",
    email: "kms@company.com",
    city: "Hồ Chí Minh",
    address: "Tòa nhà Flemington, 182 Lê Đại Hành, Quận 11, TP.HCM",
    companyModel: "Outsource",
    companyEmployees: "2.000+",
    workingTime: "Thứ 2 - Thứ 6 (8:00 - 17:00)",
    workOvertime: "Không OT bắt buộc",
    phone: "028 3512 8900",
    description: "<p>KMS Technology là công ty phần mềm với văn hóa kỹ thuật mạnh mẽ, chuyên cung cấp dịch vụ phát triển phần mềm cho thị trường Mỹ và Úc. Môi trường làm việc chuyên nghiệp, nhiều cơ hội học hỏi và phát triển.</p>",
  },
  {
    companyName: "Rikkeisoft",
    email: "rikkeisoft@company.com",
    city: "Hà Nội",
    address: "Tầng 7-8, Tòa Charmvit Tower, 117 Trần Duy Hưng, Hà Nội",
    companyModel: "Outsource",
    companyEmployees: "2.500+",
    workingTime: "Thứ 2 - Thứ 6 (8:30 - 17:30)",
    workOvertime: "Có OT khi cần",
    phone: "024 6681 8998",
    description: "<p>Rikkeisoft là công ty IT Việt Nam - Nhật Bản hàng đầu, cung cấp dịch vụ phát triển phần mềm, giải pháp chuyển đổi số cho các doanh nghiệp Nhật Bản và quốc tế. Môi trường song ngữ Việt - Nhật, nhiều cơ hội đi công tác nước ngoài.</p>",
  },
  {
    companyName: "Axon Active Vietnam",
    email: "axon@company.com",
    city: "Đà Nẵng",
    address: "Tầng 9, Tòa nhà Indochina Riverside, 74 Bạch Đằng, Đà Nẵng",
    companyModel: "Outsource",
    companyEmployees: "500+",
    workingTime: "Thứ 2 - Thứ 6 (8:00 - 17:00)",
    workOvertime: "Không OT",
    phone: "0236 3739 999",
    description: "<p>Axon Active là công ty phần mềm Thụy Sĩ với văn phòng tại Đà Nẵng. Chúng tôi áp dụng Agile/Scrum thuần túy, môi trường làm việc quốc tế, lương thưởng cạnh tranh và không làm thêm giờ.</p>",
  },
  {
    companyName: "TMA Solutions",
    email: "tma@company.com",
    city: "Hồ Chí Minh",
    address: "Tòa nhà TMA, Công viên phần mềm Quang Trung, Quận 12, TP.HCM",
    companyModel: "Outsource",
    companyEmployees: "3.000+",
    workingTime: "Thứ 2 - Thứ 6 (7:30 - 17:00)",
    workOvertime: "Có OT (tự nguyện)",
    phone: "028 3812 0888",
    description: "<p>TMA Solutions là một trong những công ty phần mềm lớn nhất Việt Nam với hơn 25 năm kinh nghiệm. Chúng tôi phát triển phần mềm cho các khách hàng tại Mỹ, châu Âu và Nhật Bản, tập trung vào các lĩnh vực viễn thông, y tế, tài chính.</p>",
  },
];

const JOB_TEMPLATES = [
  // FPT Software jobs
  {
    companyEmail: "fpt@company.com",
    title: "Senior ReactJS Developer",
    salaryMin: 2000, salaryMax: 3500,
    position: "senior", workingForm: "office",
    technologies: ["ReactJS", "TypeScript", "Redux", "NodeJS"],
    description: "<p>Tham gia phát triển các dự án web lớn cho khách hàng nước ngoài. Yêu cầu có kinh nghiệm ReactJS từ 3 năm trở lên, hiểu biết tốt về TypeScript và state management.</p><ul><li>Phát triển và maintain các ứng dụng web React quy mô lớn</li><li>Code review và mentoring junior developers</li><li>Làm việc trực tiếp với khách hàng nước ngoài</li></ul>",
  },
  {
    companyEmail: "fpt@company.com",
    title: "Backend Developer (Java Spring Boot)",
    salaryMin: 1800, salaryMax: 3000,
    position: "middle", workingForm: "flexible",
    technologies: ["Java", "Spring Boot", "MySQL", "Docker", "Kafka"],
    description: "<p>Phát triển backend cho các hệ thống phân tán quy mô lớn sử dụng Java Spring Boot. Cơ hội làm việc với các công nghệ microservices hiện đại.</p><ul><li>Xây dựng REST API và microservices</li><li>Tối ưu hiệu năng hệ thống</li><li>Triển khai CI/CD pipeline</li></ul>",
  },
  {
    companyEmail: "fpt@company.com",
    title: "DevOps Engineer",
    salaryMin: 2200, salaryMax: 4000,
    position: "senior", workingForm: "office",
    technologies: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
    description: "<p>Xây dựng và vận hành hạ tầng cloud cho các dự án lớn. Yêu cầu kinh nghiệm AWS và Kubernetes, am hiểu về bảo mật hệ thống.</p>",
  },
  // VNG jobs
  {
    companyEmail: "vng@company.com",
    title: "Frontend Developer (Vue.js)",
    salaryMin: 1500, salaryMax: 2800,
    position: "junior", workingForm: "flexible",
    technologies: ["Vue.js", "JavaScript", "HTML", "CSS", "REST API"],
    description: "<p>Phát triển giao diện người dùng cho các sản phẩm triệu người dùng của VNG như Zalo, Zing. Môi trường làm việc năng động, sản phẩm thực tế có tác động lớn.</p>",
  },
  {
    companyEmail: "vng@company.com",
    title: "Mobile Developer (Flutter)",
    salaryMin: 2000, salaryMax: 3500,
    position: "middle", workingForm: "remote",
    technologies: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
    description: "<p>Phát triển ứng dụng mobile cross-platform với Flutter cho hàng triệu người dùng. Tham gia team phát triển sản phẩm Zalo mobile.</p><ul><li>Phát triển tính năng mới cho ứng dụng mobile</li><li>Tối ưu hiệu năng và trải nghiệm người dùng</li><li>Làm việc với backend team để tích hợp API</li></ul>",
  },
  {
    companyEmail: "vng@company.com",
    title: "Data Engineer",
    salaryMin: 2500, salaryMax: 4500,
    position: "senior", workingForm: "office",
    technologies: ["Python", "Apache Spark", "Kafka", "AWS", "Airflow"],
    description: "<p>Xây dựng data pipeline và hệ thống xử lý dữ liệu lớn phục vụ cho các sản phẩm của VNG. Yêu cầu kinh nghiệm về big data và distributed systems.</p>",
  },
  // KMS Technology jobs
  {
    companyEmail: "kms@company.com",
    title: "Senior .NET Developer",
    salaryMin: 2000, salaryMax: 3500,
    position: "senior", workingForm: "office",
    technologies: [".NET", "C#", "SQL Server", "Azure", "Microservices"],
    description: "<p>Phát triển các giải pháp phần mềm cho khách hàng Mỹ và Úc sử dụng .NET stack. Code review, kiến trúc hệ thống và mentoring team.</p>",
  },
  {
    companyEmail: "kms@company.com",
    title: "QA Engineer (Automation)",
    salaryMin: 1200, salaryMax: 2200,
    position: "middle", workingForm: "flexible",
    technologies: ["Selenium", "Python", "TestNG", "JIRA", "API Testing"],
    description: "<p>Xây dựng và duy trì bộ test automation cho các dự án phần mềm. Làm việc trong môi trường Agile/Scrum, tập trung vào chất lượng sản phẩm.</p>",
  },
  {
    companyEmail: "kms@company.com",
    title: "Fresher NodeJS Developer",
    salaryMin: 700, salaryMax: 1200,
    position: "fresher", workingForm: "office",
    technologies: ["NodeJS", "JavaScript", "MongoDB", "REST API", "Git"],
    description: "<p>Cơ hội tuyệt vời cho fresher muốn bắt đầu sự nghiệp tại công ty công nghệ hàng đầu. Được đào tạo bài bản, mentoring 1-1 từ senior developers.</p>",
  },
  // Rikkeisoft jobs
  {
    companyEmail: "rikkeisoft@company.com",
    title: "ReactJS Developer (Nhật ngữ N3+)",
    salaryMin: 1800, salaryMax: 3200,
    position: "middle", workingForm: "office",
    technologies: ["ReactJS", "TypeScript", "Redux Toolkit", "Ant Design", "Git"],
    description: "<p>Phát triển ứng dụng web cho khách hàng Nhật Bản. Yêu cầu tiếng Nhật N3 để giao tiếp trực tiếp với khách hàng. Cơ hội onsite Nhật Bản.</p>",
  },
  {
    companyEmail: "rikkeisoft@company.com",
    title: "Intern Frontend Developer",
    salaryMin: 300, salaryMax: 600,
    position: "intern", workingForm: "office",
    technologies: ["HTML", "CSS", "JavaScript", "ReactJS", "Git"],
    description: "<p>Chương trình thực tập 3-6 tháng với cơ hội trở thành nhân viên chính thức. Được hướng dẫn trực tiếp từ senior developers, tham gia dự án thực tế.</p>",
  },
  {
    companyEmail: "rikkeisoft@company.com",
    title: "Business Analyst (IT)",
    salaryMin: 1500, salaryMax: 2800,
    position: "middle", workingForm: "office",
    technologies: ["JIRA", "Confluence", "SQL", "Figma", "UML"],
    description: "<p>Phân tích nghiệp vụ, cầu nối giữa khách hàng Nhật Bản và team phát triển. Yêu cầu tiếng Nhật N2+, kinh nghiệm BA trong lĩnh vực IT.</p>",
  },
  // Axon Active jobs
  {
    companyEmail: "axon@company.com",
    title: "Full-stack Developer (React + NodeJS)",
    salaryMin: 1800, salaryMax: 3500,
    position: "middle", workingForm: "remote",
    technologies: ["ReactJS", "NodeJS", "PostgreSQL", "Docker", "AWS"],
    description: "<p>Phát triển sản phẩm SaaS cho khách hàng châu Âu theo mô hình Agile thuần túy. Không làm thêm giờ, môi trường làm việc quốc tế, lương thưởng cạnh tranh.</p><ul><li>Sprint planning và retrospective hàng tuần</li><li>Làm việc với Product Owner người Thụy Sĩ</li><li>100% remote hoặc tại văn phòng Đà Nẵng</li></ul>",
  },
  {
    companyEmail: "axon@company.com",
    title: "Senior Backend Developer (Python/Django)",
    salaryMin: 2500, salaryMax: 4000,
    position: "senior", workingForm: "remote",
    technologies: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
    description: "<p>Dẫn dắt team backend phát triển REST API cho nền tảng SaaS B2B. Môi trường Agile, làm việc chặt chẽ với team frontend và design.</p>",
  },
  // TMA Solutions jobs
  {
    companyEmail: "tma@company.com",
    title: "Embedded Software Engineer",
    salaryMin: 1500, salaryMax: 3000,
    position: "junior", workingForm: "office",
    technologies: ["C/C++", "RTOS", "IoT", "Linux", "Git"],
    description: "<p>Phát triển phần mềm nhúng cho các thiết bị viễn thông và IoT. Làm việc trong môi trường kỹ thuật chuyên sâu, nhiều cơ hội học hỏi từ các chuyên gia.</p>",
  },
  {
    companyEmail: "tma@company.com",
    title: "Angular Developer",
    salaryMin: 1500, salaryMax: 2800,
    position: "junior", workingForm: "flexible",
    technologies: ["Angular", "TypeScript", "RxJS", "NgRx", "REST API"],
    description: "<p>Xây dựng giao diện web cho các hệ thống quản lý viễn thông quy mô lớn. Yêu cầu kinh nghiệm Angular từ 1 năm trở lên.</p>",
  },
  {
    companyEmail: "tma@company.com",
    title: "Fresher Java Developer",
    salaryMin: 600, salaryMax: 1000,
    position: "fresher", workingForm: "office",
    technologies: ["Java", "Spring Boot", "MySQL", "OOP", "Git"],
    description: "<p>Cơ hội tốt cho fresher mới tốt nghiệp muốn bắt đầu với Java. TMA có chương trình đào tạo bài bản kéo dài 2 tháng trước khi vào dự án thực tế.</p>",
  },
];

// ─── Main ───────────────────────────────────────────────────────────────────

async function seed() {
  const dbUrl = process.env.DATABASE;
  if (!dbUrl) {
    console.error("❌ Thiếu biến môi trường DATABASE trong .env");
    process.exit(1);
  }

  console.log("🔌 Đang kết nối MongoDB...");
  await mongoose.connect(dbUrl);
  console.log("✅ Kết nối thành công!\n");

  // 1. Seed cities
  console.log("🏙️  Tạo thành phố...");
  const cityMap: Record<string, string> = {};

  for (const name of CITIES) {
    let city = await City.findOne({ name });
    if (!city) {
      city = await City.create({ name });
      console.log(`   + Tạo: ${name}`);
    } else {
      console.log(`   ~ Đã tồn tại: ${name}`);
    }
    cityMap[name] = city._id.toString();
  }

  // 2. Seed companies
  console.log("\n🏢 Tạo công ty...");
  const companyMap: Record<string, string> = {};
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("123456", salt);

  for (const c of COMPANIES) {
    const cityId = cityMap[c.city];
    if (!cityId) {
      console.warn(`   ⚠ Không tìm thấy city "${c.city}" cho công ty "${c.companyName}"`);
      continue;
    }

    let company = await AccountCompany.findOne({ email: c.email });
    if (!company) {
      company = await AccountCompany.create({
        companyName: c.companyName,
        email: c.email,
        password: hashedPassword,
        city: cityId,
        address: c.address,
        companyModel: c.companyModel,
        companyEmployees: c.companyEmployees,
        workingTime: c.workingTime,
        workOvertime: c.workOvertime,
        phone: c.phone,
        description: c.description,
      });
      console.log(`   + Tạo: ${c.companyName} (${c.city})`);
    } else {
      console.log(`   ~ Đã tồn tại: ${c.companyName}`);
    }
    companyMap[c.email] = company._id.toString();
  }

  // 3. Seed jobs
  console.log("\n💼 Tạo việc làm...");
  let jobCreated = 0;
  let jobSkipped = 0;

  for (const j of JOB_TEMPLATES) {
    const companyId = companyMap[j.companyEmail];
    if (!companyId) {
      console.warn(`   ⚠ Không tìm thấy công ty "${j.companyEmail}"`);
      continue;
    }

    const existing = await Job.findOne({ companyId, title: j.title });
    if (!existing) {
      await Job.create({
        companyId,
        title: j.title,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        position: j.position,
        workingForm: j.workingForm,
        technologies: j.technologies,
        description: j.description,
        images: [],
      });
      console.log(`   + ${j.title}`);
      jobCreated++;
    } else {
      jobSkipped++;
    }
  }

  console.log(`\n📊 Kết quả:`);
  console.log(`   - Thành phố:  ${CITIES.length} (từ database)`);
  console.log(`   - Công ty:    ${Object.keys(companyMap).length}`);
  console.log(`   - Việc làm:   ${jobCreated} tạo mới, ${jobSkipped} đã tồn tại`);
  console.log(`\n🔑 Tài khoản đăng nhập công ty (mật khẩu: 123456):`);
  for (const c of COMPANIES) {
    console.log(`   ${c.email.padEnd(28)} — ${c.companyName}`);
  }

  await mongoose.disconnect();
  console.log("\n✅ Seeding hoàn tất!");
}

seed().catch((err) => {
  console.error("❌ Lỗi:", err);
  mongoose.disconnect();
  process.exit(1);
});
