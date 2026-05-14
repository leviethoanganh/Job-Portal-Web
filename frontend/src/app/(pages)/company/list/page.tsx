import { CompanyItem } from "@/app/components/card/CompanyItem";
import { CompanyList } from "./CompanyList";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">
            Company List
          </h2>

          <CompanyList />
        </div>
      </div>
    </>
  );
}
