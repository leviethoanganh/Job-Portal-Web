import { CompanyItem } from "@/app/components/card/CompanyItem";
import { CompanyList } from "./CompanyList";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* Tiêu đề trang - Tự động điều chỉnh kích thước trên các thiết bị */}
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">
            Danh sách công ty
          </h2>

          <CompanyList />
        </div>
      </div>
    </>
  );
}