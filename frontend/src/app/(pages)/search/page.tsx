import { Section1 } from "@/app/components/section/Section1";
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import  {  SectionSearch  }  from  "./SectionSearch" ;
import { Suspense } from "react";

export default function Page() {
  return (
    <>
      {/* Section 1: Thanh tìm kiếm chính */}
      <Section1 />

      {/* Kết quả tìm kiếm */}
      <Suspense fallback={<div className="text-center py-10">Đang tải kết quả tìm kiếm...</div>}>
        <SectionSearch />
      </Suspense>
    </>
  );
}