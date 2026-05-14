"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { cvStatusList, positionList, workingFormList } from "@/configs/variable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';
import {
  FaBriefcase,
  FaCircleCheck,
  FaEnvelope,
  FaEye,
  FaPhone,
  FaUserTie
} from "react-icons/fa6";

export const CVList = () => {
  const [listCV, setListCV] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/list`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "error") {
          toast.error(data.message);
        }

        if (data.code === "success") {
          toast.success(data.message);
          setListCV(data.listCV || []);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [count]);

  const handleChangeStatus = (id: string, status: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/change-status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        status: status,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setCount((prev) => prev + 1);
        } else {
          console.error("Status update failed:", data.message);
        }
      })
      .catch((err) => {
        console.error("API connection error:", err);
      });
  };

  const handleDelete = (id: string) => {
    const result = window.confirm("Are you sure you want to delete this CV?");

    if (result) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/cv/delete/${id}`, {
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
            setCount((prev) => prev + 1);
          }
        })
        .catch((err) => {
          console.error("Delete error:", err);
          toast.error("An error occurred while connecting to the server");
        });
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
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
                background: "linear-gradient(180deg, #F6F6F6 2.38%, #FFFFFF 70.43%)"
              }}
            >
              <img
                src="/assets/images/card-bg.png"
                alt="background"
                className="absolute top-0 left-0 w-full h-auto opacity-50"
              />

              <h3 className="mt-[20px] mx-[16px] font-[700] text-[18px] text-[#121212] text-center z-10 line-clamp-2 min-h-[54px]">
                {item.jobTitle}
              </h3>

              <div className="mt-[12px] text-center font-[400] text-[14px] text-black z-10">
                Candidate: <span className="font-[700]">{item.fullName}</span>
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaEnvelope /> {item.email}
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaPhone /> {item.phone}
              </div>

              <div className="mt-[12px] text-center font-[600] text-[16px] text-[#0088FF] z-10">
                {item.jobSalaryMin?.toLocaleString("vi-VN")} $ - {item.jobSalaryMax?.toLocaleString("vi-VN")} $
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaUserTie className="text-[16px]" /> {position?.label || "N/A"}
              </div>

              <div className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] text-[#121212] z-10">
                <FaBriefcase className="text-[16px]" /> {workingForm?.label || "N/A"}
              </div>

              <div className={`mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] z-10 ${item.viewed ? "text-[#121212]" : "text-[#FF0000]"}`}>
                <FaEye className="text-[16px]" /> {item.viewed ? "Viewed" : "Not viewed"}
              </div>

              <div
                className="mt-[6px] flex justify-center items-center gap-[8px] font-[400] text-[14px] z-10"
                style={{ color: status?.color || "#000" }}
              >
                <FaCircleCheck className="text-[16px]" /> {status?.label || "Pending"}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[12px] mb-[20px] mx-[10px] z-10">
                <Link href={`/company-manage/cv/detail/${item.id}`} className="bg-[#0088FF] rounded-[4px] font-[400] text-[14px] text-white py-[8px] px-[20px]">
                  View
                </Link>
                {item.status !== "approved" && (
                  <>
                    <button
                      className="bg-[#9FDB7C] rounded-[4px] font-[400] text-[14px] text-black inline-block py-[8px] px-[20px] hover:opacity-80 transition-all"
                      onClick={() => handleChangeStatus(item.id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="bg-[#FF5100] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:opacity-80 transition-all"
                      onClick={() => handleChangeStatus(item.id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px] hover:bg-opacity-80 transition-all"
                  onClick={() => handleDelete(item.id)}
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
