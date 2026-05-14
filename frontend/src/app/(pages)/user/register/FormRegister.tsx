"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import  {  useRouter  }  from  "next/navigation" ;

export const FormRegister = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#registerForm");

    validator
      .addField("#fullName", [
        {
          rule: "required",
          errorMessage: "Please enter your full name!",
        },
        {
          rule: "minLength",
          value: 5,
          errorMessage: "Must be at least 5 characters!",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Must be at most 50 characters!",
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
          fullName: formData.fullName.value,
          email: formData.email.value,
          password: formData.password.value,
        };

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
              router . push ( "/user/login" );
            }
          });
      });
  }, []);

  return (
    <>
      <form action="" className="grid grid-cols-1 gap-y-[15px]" id="registerForm">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
            Full Name *
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

        {/* Password */}
        <div>
          <label htmlFor="password" className="block font-[500] text-[14px] text-black mb-[5px]">
            Password *
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
          <button className="bg-primary hover:bg-opacity-90 transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};
