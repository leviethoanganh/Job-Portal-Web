import { positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";

export const JobItem = (props: { item: any }) => {
  const { item } = props;

  // Tìm label dựa trên giá trị value từ config
  const position = positionList.find((pos: any) => pos.value === item.position);
  const workingForm = workingFormList.find((work: any) => work.value === item.workingForm);

  return (
    <div className="rounded-[8px] border border-[#DEDEDE] bg-white card-item relative overflow-hidden h-full flex flex-col">
      {/* Ảnh nền trang trí */}
      <img
        src="/assets/images/card-bg.png"
        alt=""
        className="absolute top-0 left-0 w-full z-0"
      />

      <div className="p-[20px] relative z-10 flex flex-col h-full">
        {/* Logo Công ty */}
        <div className="w-[110px] aspect-square rounded-[8px] bg-white mb-[20px] p-[10px] shadow-sm border border-[#eee] mx-auto flex items-center justify-center">
          <Link href={`/job/detail/${item.id}`}>
            <img
              src={item.companyLogo || "/assets/images/default-company.png"}
              alt={item.companyName}
              className="max-w-full max-h-full object-contain"
            />
          </Link>
        </div>

        {/* Tiêu đề & Tên công ty */}
        <h3 className="font-[700] text-[18px] text-center line-clamp-2 mb-[6px] min-h-[54px]">
          <Link href={`/job/detail/${item.id}`} className="text-[#121212] hover:text-primary transition-colors">
            {item.title}
          </Link>
        </h3>
        <div className="font-[400] text-[14px] text-gray-500 mb-[12px] text-center italic">
          {item.companyName}
        </div>

        {/* Mức lương */}
        <div className="font-[600] text-[16px] text-[#0088FF] mb-[15px] text-center">
          {item.salaryMin?.toLocaleString("vi-VN")} $ - {item.salaryMax?.toLocaleString("vi-VN")} $
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-[6px] mb-[15px]">
          <div className="flex items-center justify-center gap-[6px] font-[400] text-[14px] text-[#414042]">
            <FaUserTie className="text-[#0088FF]" /> {position?.label || "N/A"}
          </div>
          <div className="flex items-center justify-center gap-[6px] font-[400] text-[14px] text-[#414042]">
            <FaBriefcase className="text-[#0088FF]" /> {workingForm?.label || "N/A"}
          </div>
          <div className="flex items-center justify-center gap-[6px] font-[400] text-[14px] text-[#414042]">
            <FaLocationDot className="text-[#0088FF]" /> {item.companyCity}
          </div>
        </div>

        {/* Tags Công nghệ */}
        <div className="flex items-center justify-center flex-wrap gap-[6px] mt-auto">
          {item.technologies?.map((tech: any, index: number) => (
            <span
              className="border border-[#DEDEDE] rounded-[20px] py-[4px] px-[12px] font-[400] text-[12px] text-[#666] bg-[#f9f9f9]"
              key={index}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};