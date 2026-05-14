"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import  {  useRouter  }  from  "next/navigation" ;

export const FormLogin = () => {
  const router = useRouter();

  useEffect(() => {
    const validator = new JustValidate("#loginForm");

    validator
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
      ])
      .onSuccess((event: any) => {
        const formData = event.target;
        const dataFinal = {
          email: formData.email.value,
          password: formData.password.value,
        };

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
              router.push( "/");
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
          <button className="bg-[#0088FF] hover:bg-opacity-90 cursor-pointer transition-all rounded-[4px] w-[100%] h-[48px] px-[20px] font-[700] text-[16px] text-white">
            Login
          </button>
        </div>
      </form>
    </>
  );
};
