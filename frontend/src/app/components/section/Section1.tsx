"use client";
import Link from "next/link";
import  {  useRouter  }  from  "next/navigation"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useEffect, useState } from "react";

export const Section1 = () => {
  const router = useRouter();
  const [cityList, setCityList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`)
      .then(res => res.json())
      .then(data => {
        if (data.code === "success") {
          setCityList(data.cityList);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (event: any) => {
    event.preventDefault();
    const city = event.target.city.value;
    const keyword = event.target.keyword.value;

    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (keyword) params.append("keyword", keyword);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-[#000065] py-[60px]">
        <div className="contain">
          <h1 className="font-[700] text-[28px] text-white mb-[30px] text-center">
            887 IT Jobs for Quality Developers
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex gap-x-[15px] gap-y-[12px] mb-[30px] md:flex-nowrap flex-wrap"
          >
            <select name="city" className="md:w-[240px] w-[100%] h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white">
              <option value="">All</option>
              {cityList.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="flex-1 h-[56px] rounded-[4px] px-[20px] font-[500] text-[16px] text-[#121212] bg-white"
              placeholder="Enter keyword..."
              name="keyword"
            />

            <button className="md:w-[240px] w-[100%] h-[56px] bg-primary rounded-[4px] text-white font-[500] text-[16px] flex items-center justify-center hover:opacity-90 transition-opacity">
              <FaMagnifyingGlass className="text-[20px] mr-[5px]" /> Search
            </button>
          </form>

          <div className="flex gap-x-[12px] gap-y-[15px] items-center flex-wrap">
            <div className="font-[500] text-[16px] text-[#DEDEDE]">
              People are searching for:
            </div>
            <div className="flex flex-wrap gap-[10px]">
              <Link
                href={`/search?language=ReactJS`}
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block transition-all"
              >
                ReactJS
              </Link>
              <Link
                href={`/search?language=Javascript`}
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block transition-all"
              >
                Javascript
              </Link>
              <Link
                href={`/search?language=NodeJS`}
                className="rounded-[20px] bg-[#121212] hover:bg-[#414042] border-[1px] border-[#414042] py-[8px] px-[22px] font-[500] text-[16px] text-[#DEDEDE] hover:text-[#FFFFFF] inline-block transition-all"
              >
                NodeJS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
