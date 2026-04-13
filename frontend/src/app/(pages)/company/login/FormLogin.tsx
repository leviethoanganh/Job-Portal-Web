"use client";

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo bộ kiểm tra dữ liệu
    const validator = new JustValidate("#loginForm");

    validator
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập email!",
        },
        {
          rule: "email",
          errorMessage: "Email không đúng định dạng!",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập mật khẩu!",
        },
      ])
      // 2. Xử lý khi dữ liệu hợp lệ và nhấn đăng nhập
      .onSuccess((event: any) => {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const dataFinal = {
          email: email,
          password: password,
        };

        // Gửi yêu cầu tới server cổng 5000
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
          credentials: "include", // Quan trọng để nhận và lưu Cookie từ Server
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              router.push("/"); // Chuyển hướng về trang chủ khi thành công
            }
          });
      });
  }, [router]);

  return (
    <>
      <form action="" className="grid grid-cols-1 gap-y-[15px]" id="loginForm">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
            Email *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Mật khẩu *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button className="bg-[#0088FF] hover:bg-opacity-90 cursor-pointer active:scale-95 transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
      </form>
    </>
  );
};