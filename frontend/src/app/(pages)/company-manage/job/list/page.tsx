import Link from "next/link";
import { FaBriefcase, FaUserTie } from "react-icons/fa6";
import { JobList } from "./JobList";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* Thanh tiêu đề và nút Thêm mới */}
          <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
            <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212]">
              Quản lý công việc
            </h2>
            <Link 
              href="/company-manage/job/create" 
              className="bg-primary rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:opacity-90 transition-opacity"
            >
              Thêm mới
            </Link>
          </div>

          <JobList />

              
        </div>
      </div>
    </>
  );
}