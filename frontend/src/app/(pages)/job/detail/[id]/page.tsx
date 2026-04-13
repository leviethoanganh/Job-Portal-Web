import { positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { FaArrowRight, FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { FormApply } from "./FormApply";

/* eslint-disable @next/next/no-img-element */

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch dữ liệu từ API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/detail/${id}`, {
    cache: 'no-store' // Đảm bảo dữ liệu luôn mới nhất
  });
  const data = await res.json();

  let jobDetail: any = null;

  if (data.code === "success") {
    jobDetail = data.jobDetail;
    // Map value sang Label để hiển thị tiếng Việt
    jobDetail.positionLabel = positionList.find(pos => pos.value === jobDetail.position)?.label || jobDetail.position;
    jobDetail.workingFormLabel = workingFormList.find(work => work.value === jobDetail.workingForm)?.label || jobDetail.workingForm;
  }

  if (!jobDetail) {
    return <div className="text-center py-10">Không tìm thấy thông tin công việc.</div>;
  }

  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="contain">
          <div className="flex gap-[20px] lg:flex-nowrap flex-wrap">

            {/* Cột Trái: Chi tiết công việc & Form ứng tuyển */}
            <div className="lg:w-[65%] w-[100%]">

              {/* 1. Thông tin chung */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] bg-white">
                <h1 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[10px]">
                  {jobDetail.title}
                </h1>
                <div className="font-[400] text-[16px] text-[#414042] mb-[10px]">
                  {jobDetail.companyName}
                </div>
                <div className="font-[700] text-[20px] text-primary sm:mb-[20px] mb-[10px]">
                  {jobDetail.salaryMin?.toLocaleString("vi-VN")} $ - {jobDetail.salaryMax?.toLocaleString("vi-VN")} $
                </div>

                <Link
                  href="#boxApplyForm"
                  className="flex items-center justify-center h-[48px] bg-primary rounded-[4px] font-[700] text-[16px] text-white mb-[20px] hover:opacity-90 transition-opacity"
                >
                  Ứng tuyển ngay
                </Link>

                {/* Danh sách ảnh */}
                <div className="grid grid-cols-3 sm:gap-[16px] gap-[8px] mb-[20px]">
                  {jobDetail.pictures?.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`job-pic-${index}`}
                      className="w-[100%] aspect-[232/145] rounded-[4px] object-cover border border-[#DEDEDE]"
                    />
                  ))}
                </div>

                {/* Đặc điểm công việc */}
                <div className="space-y-[10px] mb-[20px]">
                  <div className="flex items-center gap-x-[8px] font-[400] text-[14px] text-[#121212]">
                    <FaUserTie className="text-[16px] text-primary" />
                    <b>Cấp bậc:</b> {jobDetail.positionLabel}
                  </div>
                  <div className="flex items-center gap-x-[8px] font-[400] text-[14px] text-[#121212]">
                    <FaBriefcase className="text-[16px] text-primary" />
                    <b>Hình thức:</b> {jobDetail.workingFormLabel}
                  </div>
                  <div className="flex items-start gap-x-[8px] font-[400] text-[14px] text-[#121212]">
                    <FaLocationDot className="text-[16px] text-primary mt-[2px]" />
                    <span><b>Địa chỉ:</b> {jobDetail.companyAddress}</span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex gap-[8px] flex-wrap">
                  {jobDetail.technologies?.map((tech: string, index: number) => (
                    <span key={index} className="rounded-[20px] border border-[#DEDEDE] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. Mô tả chi tiết */}
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px] bg-white">
                <h2 className="font-[700] text-[20px] text-black mb-[15px]">Mô tả công việc</h2>
                <div
                  className="text-[#414042] text-[16px] leading-relaxed editor-content"
                  dangerouslySetInnerHTML={{ __html: jobDetail.description }}
                />
              </div>

              {/* 3. Form ứng tuyển thực tế */}
              <div id="boxApplyForm" className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px] bg-white">
                <h2 className="font-[700] text-[20px] text-black mb-[20px]">Gửi hồ sơ ứng tuyển</h2>
                {/* Thay thế phần thông báo cũ bằng component FormApply */}
                <FormApply jobId={jobDetail.id} />
              </div>
            </div>

            {/* Cột Phải: Thông tin công ty */}
            <div className="flex-1">
              <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] sticky top-[20px] bg-white">
                <div className="flex items-start gap-x-[12px]">
                  <img
                    src={jobDetail.companyLogo || "/assets/images/no-logo.png"}
                    alt={jobDetail.companyName}
                    className="w-[80px] aspect-square rounded-[4px] object-contain border p-1"
                  />
                  <div className="flex-1">
                    <div className="font-[700] text-[18px] text-[#121212] mb-[5px]">
                      {jobDetail.companyName}
                    </div>
                    <Link
                      href={`/company/detail/${jobDetail.companyId}`}
                      className="flex gap-x-[5px] items-center font-[400] text-[14px] text-primary hover:underline"
                    >
                      Xem trang công ty <FaArrowRight className="text-[12px]" />
                    </Link>
                  </div>
                </div>

                {/* Thông số công ty */}
                <div className="mt-[20px] flex flex-col gap-[12px]">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-[#A6A6A6] text-[14px]">Mô hình</span>
                    <span className="text-[#121212] text-[14px] font-[500]">{jobDetail.companyModel}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-[#A6A6A6] text-[14px]">Quy mô</span>
                    <span className="text-[#121212] text-[14px] font-[500]">{jobDetail.companyEmployees}</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-[#A6A6A6] text-[14px]">Lịch làm việc</span>
                    <span className="text-[#121212] text-[14px] font-[500]">{jobDetail.companyWorkingTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A6A6A6] text-[14px]">Làm thêm giờ</span>
                    <span className="text-[#121212] text-[14px] font-[500]">{jobDetail.companyWorkOvertime}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}