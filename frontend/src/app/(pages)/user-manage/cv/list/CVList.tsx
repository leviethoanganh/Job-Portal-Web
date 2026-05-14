"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { cvStatusList, positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaCircleCheck, FaUserTie } from "react-icons/fa6";
import { toast } from "sonner";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setListCV(data.listCV || []);
        }
      })
      .catch((err) => console.error("CV fetch error:", err));
  }, []);

  const handleDeleteCV = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/cv/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.code === "success") {
        toast.success(data.message || "Deleted successfully!");
        setListCV((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(data.message || "Delete failed!");
      }
    } catch (error) {
      toast.error("An error occurred while deleting!");
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {listCV.map((item) => {
          const position = positionList.find((pos) => pos.value == item.jobPosition);
          const workingForm = workingFormList.find((form) => form.value == item.jobWorkingForm);
          const status = cvStatusList.find((itemStatus) => itemStatus.value == item.status);

          return (
            <div
              key={item.id}
              className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
            >
              <img
                src="/assets/images/card-bg.png"
                alt=""
                className="absolute top-0 left-0 w-full h-auto opacity-40"
              />

              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center z-10 line-clamp-2 min-h-[54px]">
                {item.jobTitle}
              </h3>

              <div className="mt-[12px] text-center font-[400] text-[14px] text-black z-10">
                Company: <span className="font-[700]">{item.companyName}</span>
              </div>

              <div className="mt-[6px] text-center font-[600] text-[16px] text-[#0088FF] z-10">
                {item.jobSalaryMin?.toLocaleString("vi-VN")} $ - {item.jobSalaryMax?.toLocaleString("vi-VN")} $
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaUserTie className="text-[16px]" /> {position?.label || "N/A"}
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label || "N/A"}
              </div>

              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] z-10"
                style={{ color: status?.color || "#121212" }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label || "Processing"}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px] z-10">
                <Link
                  href={`/user-manage/cv/detail/${item.id}`}
                  className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:bg-opacity-80 transition-all"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteCV(item.id)}
                  className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:bg-opacity-80 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Placeholder */}
      <div className="mt-[30px]">
        <select className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]">
          <option value="1">Page 1</option>
          <option value="2">Page 2</option>
          <option value="3">Page 3</option>
        </select>
      </div>
    </>
  );
};
