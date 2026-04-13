"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import  {  useRouter  }  from  "next/navigation" ;

export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo bộ kiểm tra dữ liệu khi trang load xong
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
      // 2. Chỉ thực thi khi người dùng bấm nút và dữ liệu hợp lệ
      .onSuccess((event: any) => {
        const formData = event.target;
        const dataFinal = {
          email: formData.email.value,
          password: formData.password.value,
        };

        // Gửi yêu cầu đăng nhập tới Server cổng 5000
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
          credentials :  "include"
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              console.log("Chuyển sang trang chủ");
              router.push( "/");
              // Anh có thể sử dụng router.push('/') của Next.js tại đây
            }
          });
      });
  }, []);

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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
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
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button className="bg-[#0088FF] hover:bg-opacity-90 cursor-pointer transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng nhập
          </button>
        </div>
      </form>
    </>
  );
};