import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import { JobItem } from "@/app/components/card/JobItem";

/* eslint-disable @next/next/no-img-element */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // It's good practice to wrap server-side fetches in try/catch 
  // or handle failed responses explicitly
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/detail/${id}`, {
    cache: 'no-store' // Use this if your company data changes frequently
  });

  const data = await res.json();

  let companyDetail: any = null;
  let jobList: any = null;

  if (data.code === "success") {
    companyDetail = data.companyDetail;
    jobList = data.jobs;
  }

  // Handle cases where the company isn't found
  if (!companyDetail) {
    return <div className="p-10 text-center">Company not found.</div>;
  }


  return (
    <>
      <div className="pt-[30px] pb-[60px]">
        <div className="contain">

          {/* 1. Thông tin chung về công ty */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex items-start gap-[16px] sm:flex-row flex-col">
              {/* Logo công ty - Responsive kích thước trên mobile */}
              <img
                alt={companyDetail.companyName}
                className="w-[100px] aspect-square rounded-[4px] object-cover border p-1"
                src={companyDetail.logo}
              />
              <div className="flex-1">
                <div className="font-[700] text-[28px] text-[#121212] mb-[10px]">
                  {companyDetail.companyName}
                </div>
                <div className="flex gap-[8px] items-start font-[400] text-[14px] text-[#121212]">
                  <FaLocationDot className="text-[16px] mt-[2px] text-primary" />
                  <span>{companyDetail.address}</span>
                </div>
              </div>
            </div>

            {/* Thông số chi tiết của công ty */}
            <div className="mt-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-[5px] flex-wrap border-b pb-2">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Mô hình công ty:</div>
                <div className="font-[400] text-[16px] text-[#121212]">{companyDetail.companyModel}</div>
              </div>
              <div className="flex gap-[5px] flex-wrap border-b pb-2">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Quy mô công ty:</div>
                <div className="font-[400] text-[16px] text-[#121212]">{companyDetail.companyEmployees}</div>
              </div>
              <div className="flex gap-[5px] flex-wrap border-b pb-2">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Thời gian làm việc:</div>
                <div className="font-[400] text-[16px] text-[#121212]">{companyDetail.workingTime}</div>
              </div>
              <div className="flex gap-[5px] flex-wrap">
                <div className="font-[400] text-[16px] text-[#A6A6A6]">Làm việc ngoài giờ:</div>
                <div className="font-[400] text-[16px] text-[#121212]">{companyDetail.workOvertime}</div>
              </div>
            </div>
          </div>

          {/* 2. Mô tả chi tiết về công ty */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
            <h2 className="font-[700] text-[20px] mb-[10px]">Mô tả chi tiết</h2>
            <div
              className="text-[#414042] text-[16px] leading-relaxed editor-content"
              dangerouslySetInnerHTML={{ __html: companyDetail.description }}
            />
          </div>

          {/* 3. Danh sách việc làm đang tuyển dụng */}
          <div className="mt-[30px]">
            <h2 className="font-[700] text-[28px] text-[#121212] mb-[20px]">
              Công ty có {jobList.length} việc làm
            </h2>

            {jobList && jobList.length > 0 ? (
              <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
                {jobList.map((item: any) => (
                  <JobItem item={item} key={item.id} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 border border-[#DEDEDE] rounded-[8px]">
                Hiện tại chưa có công việc nào từ công ty này.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}