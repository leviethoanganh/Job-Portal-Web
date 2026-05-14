import Link from "next/link";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
import { CVList } from "./CVList";

/* eslint-disable @next/next/no-img-element */
export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          <h2 className="font-[700] sm:text-[28px] text-[24px] sm:w-auto w-[100%] text-[#121212] mb-[20px]">
            Manage Submitted CVs
          </h2>

          <CVList />
        </div>
      </div>
    </>
  );
}
