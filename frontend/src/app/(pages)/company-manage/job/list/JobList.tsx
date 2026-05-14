"use client";

import { positionList, workingFormList } from "@/configs/variable";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBriefcase, FaUserTie } from "react-icons/fa6";
import { Toaster, toast } from 'sonner';

export const JobList = () => {
  const [jobList, setJobList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/list?page=${page}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setJobList(data.jobs);
          setTotalPage(data.totalPage);
        }
      })
      .catch((err) => console.error("Error fetching job list:", err));
  }, [page, count]);



  const handlePagination = (event: any) => {
    const value = parseInt(event.target.value);
    setPage(value);
  };

  const handleDelete = (id: string) => {
    const result = window.confirm("Are you sure you want to delete this job?");

    if (result) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/job/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code === "error") {
            toast.error(data.message);
          }

          if (data.code === "success") {
            toast.success(data.message);
            setCount(count + 1);
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error("An error occurred, please try again!");
        });
    }
  };

  return (
    <>
      <Toaster  richColors  position = "top-right" />
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
        {jobList.map((item: any) => {
          const position = positionList.find((pos) => pos.value === item.position);
          const workingForm = workingFormList.find((work) => work.value === item.workingForm);

          return (
            <div
              className="border border-[#DEDEDE] rounded-[8px] flex flex-col relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)",
              }}
              key={item._id || item.id}
            >
              <img
                src="/assets/images/card-bg.png"
                alt=""
                className="absolute top-0 left-0 w-full h-auto z-0"
              />

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center flex-1 whitespace-normal line-clamp-2">
                  {item.title}
                </h3>

                <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF]">
                  {item.salaryMin?.toLocaleString()} $ - {item.salaryMax?.toLocaleString()} $
                </div>

                <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                  <FaUserTie className="text-[16px]" /> {position?.label || "N/A"}
                </div>

                <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212]">
                  <FaBriefcase className="text-[16px]" /> {workingForm?.label || "N/A"}
                </div>

                <div className="mt-[12px] mb-[20px] mx-[16px] flex flex-wrap justify-center gap-[8px]">
                  {item.technologies?.map((tech: string, index: number) => (
                    <div
                      className="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042] bg-white"
                      key={index}
                    >
                      {tech}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-[12px] mb-[20px]">
                  <Link
                    href={`/company-manage/job/edit/${item.id}`}
                    className="bg-[#FFB200] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px] hover:opacity-80 transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:bg-[#cc0000] transition-all"
                    onClick={() => handleDelete(item.id || item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-[30px]">
        <select
          className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042] bg-white outline-none cursor-pointer"
          onChange={handlePagination}
          value={page}
        >
          {Array(totalPage).fill("").map((_, index) => (
            <option value={index + 1} key={index}>
              Page {index + 1}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
