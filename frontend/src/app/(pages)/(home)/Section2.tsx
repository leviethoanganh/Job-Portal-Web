"use client"; // Cần có dấu chấm phẩy và tách biệt hàng

import { CompanyItem } from "@/app/components/card/CompanyItem";
import { useEffect, useState } from "react";

export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);

  useEffect(() => {
    // Thêm kiểm tra env để tránh fetch lỗi URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (apiUrl) {
      fetch(`${apiUrl}/company/list?limitItems=12`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "success") {
            setCompanyList(data.companyList || []); // Đảm bảo luôn là mảng
          }
        })
        .catch((err) => console.error("Lỗi fetch danh sách công ty:", err));
    }
  }, []);

  return (
    <section className="py-[60px]">
      <div className="contain mx-auto"> {/* Thêm mx-auto để căn giữa nội dung */}
        <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] mb-[30px] text-center">
          Nhà tuyển dụng hàng đầu
        </h2>
        
        <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-x-[20px] gap-x-[10px] gap-y-[20px]">
          {/* Kiểm tra mảng trước khi map để tránh lỗi khi dữ liệu chưa về */}
          {companyList.length > 0 ? (
            companyList.map((item) => (
              <CompanyItem item={item} key={item.id || item._id} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Đang tải danh sách nhà tuyển dụng...
            </p>
          )}
        </div>
      </div>
    </section>
  );
};