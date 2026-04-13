"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CompanyItem } from "@/app/components/card/CompanyItem";
import { useEffect, useState } from "react";

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    // Note: Ensure NEXT_PUBLIC_API_URL is defined in your .env.local
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setCompanyList(data.companyList);
          setTotalPage(data.totalPage);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [page]);

  // Your handler function
  const handlePagination = (event: any) => {
    const value = parseInt(event.target.value);
    setPage(value);
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-x-[20px] gap-x-[10px] gap-y-[20px]">
        {companyList.map((item) => (
          <CompanyItem item={item} key={item.id} />
        ))}
      </div>

      <div className="mt-[30px]">
        <select
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
          onChange={handlePagination}
          value={page} // Keeps the dropdown synced with your state
        >
          {Array(totalPage).fill("").map((_, index) => (
            <option value={index + 1} key={index}>
              Trang {index + 1}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};