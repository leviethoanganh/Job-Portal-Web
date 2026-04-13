"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import  {  useRouter  }  from  "next/navigation" ;

export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    // 1. Khởi tạo Validator ngay khi component vừa hiện ra (Mount)
    const validator = new JustValidate("#registerForm");

    // 2. Thiết lập các quy tắc kiểm tra (Rules) cho từng trường
    validator
      .addField("#fullName", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập họ tên!",
        },
        {
          rule: "minLength",
          value: 5,
          errorMessage: "Vui lòng nhập ít nhất 5 ký tự!",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Vui lòng nhập tối đa 50 ký tự!",
        },
      ])
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
        {
          rule: "minLength",
          value: 8,
          errorMessage: "Mật khẩu phải có ít nhất 8 ký tự!",
        },
        {
          rule: "customRegexp",
          value: /[a-z]/,
          errorMessage: "Mật khẩu phải chứa ký tự thường!",
        },
        {
          rule: "customRegexp",
          value: /[A-Z]/,
          errorMessage: "Mật khẩu phải chứa ký tự hoa!",
        },
        {
          rule: "customRegexp",
          value: /\d/,
          errorMessage: "Mật khẩu phải chứa chữ số!",
        },
        {
          rule: "customRegexp",
          value: /[^A-Za-z0-9]/,
          errorMessage: "Mật khẩu phải chứa ký tự đặc biệt!",
        },
      ])
      // 3. Logic xử lý KHI BẤM NÚT và DỮ LIỆU HỢP LỆ
      .onSuccess((event: any) => {
        const formData = event.target;
        const dataFinal = {
          fullName: formData.fullName.value,
          email: formData.email.value,
          password: formData.password.value,
        };

        // Gửi dữ liệu về Server
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.code === "error") {
              alert(data.message);
            }
            if (data.code === "success") {
              alert(data.message);
              console.log("Viết logic chuyển sang trang đăng nhập...");
              router . push ( "/user/login" );
            }
          });
      });
  }, []); // Mảng phụ thuộc rỗng: Chỉ chạy khởi tạo 1 lần duy nhất

  return (
    <>
      <form action="" className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
        {/* Họ tên */}
        <div>
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Họ tên *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
          />
        </div>

        {/* Email */}
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

        {/* Mật khẩu */}
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

        {/* Nút đăng ký */}
        <div>
          <button className="bg-primary hover:bg-opacity-90 transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
};