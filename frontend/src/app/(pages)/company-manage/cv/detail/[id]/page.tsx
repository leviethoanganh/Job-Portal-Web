/* eslint-disable @typescript-eslint/no-explicit-any */
import { positionList, workingFormList } from "@/configs/variable";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const headersList = await headers();
  const cookie = headersList.get('cookie');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/detail/${id}`, {
    method: "GET",
    headers: {
      cookie: cookie || "",
    },
    cache: "no-store",
  });

  const data = await res.json();

  let infoCV: any = null;
  let infoJob: any = null;

  if (data.code === "success") {
    infoCV = data.infoCV;
    infoJob = data.infoJob;

    // Chuyển đổi value sang label để hiển thị
    if (infoJob) {
      infoJob.positionLabel = positionList.find(pos => pos.value === infoJob.position)?.label;
      infoJob.workingFormLabel = workingFormList.find(work => work.value === infoJob.workingForm)?.label;
    }
  }

  if (!infoCV) {
    return <div className="p-10 text-center text-red-500 font-bold">Không tìm thấy thông tin hồ sơ.</div>;
  }

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* 1. Thông tin CV */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV
              </h2>
              <Link href="/company-manage/cv/list" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên: <span className="font-[700] ml-[5px]">{infoCV.fullName}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              E-mail: <span className="font-[700] ml-[5px]">{infoCV.email}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại: <span className="font-[700] ml-[5px]">{infoCV.phone}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>

            <div className="bg-[#D9D9D9] h-[736px] rounded-[8px] overflow-hidden">
              {infoCV.fileCV ? (
                infoCV.fileCV.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(infoCV.fileCV)}&embedded=true`}
                    width="100%"
                    height="100%"
                    className="border-none"
                  ></iframe>
                ) : (
                  <img
                    src={infoCV.fileCV}
                    alt="CV File"
                    className="w-full object-contain h-[736px]"
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Không có file CV để hiển thị.
                </div>
              )}
            </div>
          </div>

          {/* 2. Thông tin công việc */}
          {infoJob && (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
                Thông tin công việc
              </h2>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Tên công việc: <span className="font-[700] ml-[5px]">{infoJob.title}</span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Mức lương:
                <span className="font-[700] ml-[5px]">
                  {infoJob.salaryMin?.toLocaleString("vi-VN")} $ - {infoJob.salaryMax?.toLocaleString("vi-VN")} $
                </span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Cấp bậc: <span className="font-[700] ml-[5px]">{infoJob.positionLabel}</span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Hình thức làm việc: <span className="font-[700] ml-[5px]">{infoJob.workingFormLabel}</span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Công nghệ:
                <span className="font-[700] ml-[5px]">
                  {infoJob.technologies?.join(", ")}
                </span>
              </div>

              <Link
                href={`/company-manage/job/edit/${infoJob.id}`}
                className="font-[400] text-[14px] text-[#0088FF] underline mt-[10px] inline-block"
                target="_blank"
              >
                Xem chi tiết công việc
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}