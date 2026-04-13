import { Section1 } from "@/app/components/section/Section1";
import Link from "next/link";
import { FaBriefcase, FaLocationDot, FaUserTie } from "react-icons/fa6";
import  {  SectionSearch  }  from  "./SectionSearch" ;

export default function Page() {
  return (
    <>
      {/* Section 1: Thanh tìm kiếm chính */}
      <Section1 />

      {/* Kết quả tìm kiếm */}
      <SectionSearch />
    </>
  );
}