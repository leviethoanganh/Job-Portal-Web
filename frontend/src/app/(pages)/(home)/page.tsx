
import  {Section1}  from  "@/app/components/section/Section1" ;
import Link from "next/link";
import  {  FaMagnifyingGlass , FaUserTie } from "react-icons/fa6" ;
import { Section2 } from "./Section2";

export default function Home() {
  return (
    <>
      {/* Section 1: Tìm kiếm việc làm */}
        <Section1 />
      {/* End Section 1 */}

      {/* Section 2: Danh sách nhà tuyển dụng hàng đầu */}
        <Section2 />
      {/* End Section 2 */}
    </>

  );
}