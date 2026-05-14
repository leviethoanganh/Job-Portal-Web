"use client";

import { JobItem } from "@/app/components/card/JobItem";
import { useRouter, useSearchParams } from "next/navigation";
import { positionList, workingFormList } from "@/configs/variable";
import { useEffect, useState } from "react";

export const SectionSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = searchParams.get("language") || "";
  const city = searchParams.get("city") || "";
  const company = searchParams.get("company") || "";
  const keyword = searchParams.get("keyword") || "";
  const position = searchParams.get("position") || "";
  const workingForm = searchParams.get("workingForm") || "";

  const [jobList, setJobList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const query = new URLSearchParams();
    if (language) query.append("language", language);
    if (city) query.append("city", city);
    if (company) query.append("company", company);
    if (keyword) query.append("keyword", keyword);
    if (position) query.append("position", position);
    if (workingForm) query.append("workingForm", workingForm);
    query.append("page", page.toString());

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          setJobList(data.jobs || []);
          setTotalPage(data.totalPage);
          setTotalRecord(data.totalRecord);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [language, city, company, keyword, position, workingForm, page]);

  const handleFilterPosition = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("position", value);
    } else {
      params.delete("position");
    }

    router.push(`/search?${params.toString()}`);
  };


  const handleFilterWorkingForm = (event: any) => {
    const value = event.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("workingForm", value);
    } else {
      params.delete("workingForm");
    }

    router.push(`/search?${params.toString()}`);
  };


  const handlePagination = (event: any) => {
    const value = parseInt(event.target.value);
    setPage(value);
  };

  return (
    <section className="py-[60px]">
      <div className="contain mx-auto">
        <h2 className="mb-[30px] font-[700] text-[28px] text-[#121212]">
          <span>
            {isLoading ? "Searching" : `${totalRecord} job(s)`}
          </span>
          <span className="text-[#0088FF] ml-[10px] italic">
            {language} {city} {company} {keyword}
          </span>
        </h2>

        {/* Filter Bar */}
        <div
          className="py-[15px] px-[20px] rounded-[8px] flex flex-wrap gap-[12px] mb-[30px] bg-white"
          style={{ boxShadow: "0px 4px 20px 0px #0000000F" }}
        >
          <select className="h-[36px] border border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[14px] text-[#414042] outline-none focus:border-primary" onChange={handleFilterPosition} defaultValue={position}>
            <option value="">Position</option>
            {positionList.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <select className="h-[36px] border border-[#DEDEDE] rounded-[20px] px-[18px] font-[400] text-[14px] text-[#414042] outline-none focus:border-primary" onChange={handleFilterWorkingForm} defaultValue={workingForm}>
            <option value="">Working Form</option>
            {workingFormList.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Job List */}
        <div className="relative min-h-[100px]">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : (
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[20px]">
              {jobList.length > 0 ? (
                jobList.map((item) => (
                  <JobItem key={item.id || item._id} item={item} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
                  No matching jobs found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {jobList.length > 0 && (
          <div className="mt-[40px] flex justify-center">
            <select
              className="border border-[#DEDEDE] rounded-[8px] py-[12px] px-[18px] font-[400] text-[16px] text-[#414042]"
              onChange={handlePagination}
            >
              {Array(totalPage).fill("").map((item, index) => (
                <option value={index + 1} key={index}>
                  Page {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </section>
  );
};
