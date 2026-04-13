import Link from "next/link";
import { FormEdit } from "./FormEdit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Giải nén params để lấy id của công việc từ URL
  // Vì params trong Next.js (phiên bản mới) là một Promise, chúng ta cần await nó.
  const { id } = await params;

  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <div className="border border-[#DEDEDE] rounded-[8px] p-[20px] bg-white">
            
            {/* Header của trang chỉnh sửa */}
            <div className="flex flex-wrap gap-[20px] items-center justify-between mb-[20px]">
              <h1 className="sm:w-auto w-full font-[700] text-[20px] text-black">
                Chỉnh sửa công việc
              </h1>
              
              <Link 
                href="/company-manage/job/list" 
                className="font-[400] text-[14px] text-[#0088FF] hover:text-[#0055aa] underline transition-all"
              >
                Quay lại danh sách
              </Link>
            </div>

            {/* 2. Truyền ID vào Client Component FormEdit để xử lý logic */}
            <FormEdit id={id} />

          </div>
        </div>
      </div>
    </>
  );
}