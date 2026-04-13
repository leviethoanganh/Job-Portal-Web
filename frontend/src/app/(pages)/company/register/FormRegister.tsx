"use client";

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    // Khởi tạo bộ kiểm tra dữ liệu khi Component được gắn vào DOM
    const validator = new JustValidate("#registerForm");

    validator
      .addField("#companyName", [
        {
          rule: "required",
          errorMessage: "Vui lòng nhập tên công ty!",
        },
        {
          rule: "maxLength",
          value: 200,
          errorMessage: "Vui lòng nhập tối đa 200 ký tự!",
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
      // Chỉ thực hiện gửi dữ liệu khi tất cả các trường đều hợp lệ
      .onSuccess((event: any) => {
        const formData = event.target;
        const dataFinal = {
          companyName: formData.companyName.value,
          email: formData.email.value,
          password: formData.password.value,
        };

        // Gửi yêu cầu đăng ký tới endpoint dành riêng cho công ty
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/register`, {
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
              // Chuyển hướng sang trang đăng nhập của công ty
              router.push("/company/login");
            }
          });
      });
  }, [router]);

  return (
    <>
      <form action="" className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
        {/* Company Name Field */}
        <div>
          <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Tên công ty *
          </label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
          />
        </div>

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
            Đăng ký
          </button>
        </div>
      </form>
    </>
  );
};