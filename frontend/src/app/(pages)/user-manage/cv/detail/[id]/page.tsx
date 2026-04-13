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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/detail/${id}`, {
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
    return <div className="p-10 text-center text-red-500 font-bold">Không tìm thấy thông tin hồ sơ hoặc bạn không có quyền xem.</div>;
  }

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* 1. Thông tin CV */}
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px]">
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black">
                Thông tin CV đã nộp
              </h2>
              <Link href="/user-manage/cv/list" className="font-[400] text-[14px] text-[#0088FF] underline">
                Quay lại danh sách
              </Link>
            </div>

            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Họ tên: <span className="font-[700] ml-[5px]">{infoCV.fullName}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              E-mail gửi: <span className="font-[700] ml-[5px]">{infoCV.email}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Số điện thoại: <span className="font-[700] ml-[5px]">{infoCV.phone}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              Trạng thái: <span className="font-[700] ml-[5px] uppercase">{infoCV.status === "initial" ? "Đang xử lý / Chờ ứng tuyển" : infoCV.status === "approved" ? "Thành công (Duyệt)" : infoCV.status === "rejected" ? "Bị từ chối" : infoCV.status}</span>
            </div>
            <div className="font-[400] text-[16px] text-black mb-[10px]">
              File CV:
            </div>

            <div className="bg-[#D9D9D9] h-[736px] rounded-[8px] overflow-hidden">
              {infoCV.fileCV ? (
                infoCV.fileCV.toLowerCase().endsWith(".pdf") ? (
                  <iframe
                    src={infoCV.fileCV}
                    width="100%"
                    height="100%"
                    className="border-none"
                  ></iframe>
                ) : (
                  <div className="w-full h-full overflow-y-auto flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={infoCV.fileCV}
                      alt="CV File"
                      className="w-full h-auto"
                    />
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Không có file CV được tải lên.
                </div>
              )}
            </div>
          </div>

          {/* 2. Thông tin công việc */}
          {infoJob && (
            <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] mt-[20px]">
              <h2 className="sm:w-auto w-[100%] font-[700] text-[20px] text-black mb-[20px]">
                Chi tiết công việc đã ứng tuyển
              </h2>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Công ty đăng tuyển: <span className="font-[700] ml-[5px] text-[#0088FF]">{infoJob.companyName || "N/A"}</span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Tên công việc: <span className="font-[700] ml-[5px]">{infoJob.title}</span>
              </div>

              <div className="font-[400] text-[16px] text-black mb-[10px]">
                Mức lương:
                <span className="font-[700] ml-[5px] text-[#0088FF]">
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
                Công nghệ yêu cầu:
                <span className="font-[700] ml-[5px]">
                  {infoJob.technologies?.join(", ") || "-"}
                </span>
              </div>

              <Link
                href={`/job/detail/${infoJob.id}`}
                className="font-[400] text-[14px] text-[#0088FF] underline mt-[10px] inline-block hover:opacity-80 transition-all"
                target="_blank"
              >
                Xem chi tiết tin tuyển dụng
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
