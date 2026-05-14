"use client";

import JustValidate from "just-validate";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#registerForm");

    validator
      .addField("#companyName", [
        {
          rule: "required",
          errorMessage: "Please enter company name!",
        },
        {
          rule: "maxLength",
          value: 200,
          errorMessage: "Must be at most 200 characters!",
        },
      ])
      .addField("#email", [
        {
          rule: "required",
          errorMessage: "Please enter your email!",
        },
        {
          rule: "email",
          errorMessage: "Invalid email format!",
        },
      ])
      .addField("#password", [
        {
          rule: "required",
          errorMessage: "Please enter your password!",
        },
        {
          rule: "minLength",
          value: 8,
          errorMessage: "Password must be at least 8 characters!",
        },
        {
          rule: "customRegexp",
          value: /[a-z]/,
          errorMessage: "Password must contain a lowercase letter!",
        },
        {
          rule: "customRegexp",
          value: /[A-Z]/,
          errorMessage: "Password must contain an uppercase letter!",
        },
        {
          rule: "customRegexp",
          value: /\d/,
          errorMessage: "Password must contain a number!",
        },
        {
          rule: "customRegexp",
          value: /[^A-Za-z0-9]/,
          errorMessage: "Password must contain a special character!",
        },
      ])
      .onSuccess((event: any) => {
        const formData = event.target;
        const dataFinal = {
          companyName: formData.companyName.value,
          email: formData.email.value,
          password: formData.password.value,
        };

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
            Company Name *
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
            Password *
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
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};
