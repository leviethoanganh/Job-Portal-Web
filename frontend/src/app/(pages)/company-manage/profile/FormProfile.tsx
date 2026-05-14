"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Toaster, toast } from 'sonner';
import { EditorMCE } from "@/app/components/editor/EditorMCE";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoCompany } = useAuth();
  const [logos, setLogos] = useState<any[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [cityList, setCityList] = useState<any[]>([]);

  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/city/list`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch city list");
        return res.json();
      })
      .then(data => {
        if (data.code === "success") {
          setCityList(data.cityList);
        }
      })
      .catch(err => console.log("City list fetch error:", err));
  }, []);

  useEffect(() => {
    if (!infoCompany) return;

    if (infoCompany.logo) {
      setLogos([
        {
          source: infoCompany.logo,
          options: { type: 'local' }
        }
      ]);
    }

    const validator = new JustValidate('#profileForm');

    validator
      .addField("#companyName", [
        {
          rule: "required",
          errorMessage: "Please enter company name!",
        },
        {
          rule: 'maxLength',
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
      .onFail(() => {
        setIsValid(false);
      })
      .onSuccess(() => {
        setIsValid(true);
      });

    return () => {
      validator.destroy();
    };
  }, [infoCompany]);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (isValid) {
      const formData = new FormData();

      formData.append("companyName", event.target.companyName.value);
      formData.append("city", event.target.city.value);
      formData.append("address", event.target.address.value);
      formData.append("companyModel", event.target.companyModel.value);
      formData.append("companyEmployees", event.target.companyEmployees.value);
      formData.append("workingTime", event.target.workingTime.value);
      formData.append("workOvertime", event.target.workOvertime.value);
      formData.append("email", event.target.email.value);
      formData.append("phone", event.target.phone.value);

      if (editorRef.current) {
        formData.append("description", editorRef.current.getContent());
      }

      if (logos.length > 0 && logos[0].file) {
        formData.append("logo", logos[0].file);
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/profile`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === "error") {
            toast.error(data.message);
          } else if (data.code === "success") {
            toast.success(data.message);
          }
        })
        .catch(err => {
          toast.error("An error occurred while updating!");
          console.error(err);
        });
    } else {
      toast.error("Please check the form information!");
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      {infoCompany && (
        <form
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          id="profileForm"
          onSubmit={handleSubmit}
        >
          {/* Company Name */}
          <div className="sm:col-span-2">
            <label htmlFor="companyName" className="block font-[500] text-[14px] text-black mb-[5px]">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyName}
            />
          </div>

          {/* Logo */}
          <div className="sm:col-span-2">
            <label htmlFor="logo" className="block font-[500] text-[14px] text-black mb-[5px]">
              Logo
            </label>
            <FilePond
              name="logo"
              labelIdle='Drag & drop or <span class="filepond--label-action">Choose image</span>'
              acceptedFileTypes={['image/*']}
              files={logos}
              onupdatefiles={setLogos}
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block font-[500] text-[14px] text-black mb-[5px]">
              City
            </label>
            <select
              name="city"
              id="city"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.city}
            >
              {cityList.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-[500] text-[14px] text-black mb-[5px]">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.address}
            />
          </div>

          <div>
            <label htmlFor="companyModel" className="block font-[500] text-[14px] text-black mb-[5px]">
              Company Model
            </label>
            <input
              type="text"
              name="companyModel"
              id="companyModel"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyModel}
            />
          </div>

          <div>
            <label htmlFor="companyEmployees" className="block font-[500] text-[14px] text-black mb-[5px]">
              Company Size
            </label>
            <input
              type="text"
              name="companyEmployees"
              id="companyEmployees"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.companyEmployees}
            />
          </div>

          <div>
            <label htmlFor="workingTime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Working Hours
            </label>
            <input
              type="text"
              name="workingTime"
              id="workingTime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workingTime}
            />
          </div>

          <div>
            <label htmlFor="workOvertime" className="block font-[500] text-[14px] text-black mb-[5px]">
              Overtime
            </label>
            <input
              type="text"
              name="workOvertime"
              id="workOvertime"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.workOvertime}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-[500] text-[14px] text-black mb-[5px]">
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.email}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black"
              defaultValue={infoCompany.phone}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block font-[500] text-[14px] text-black mb-[5px]">
              Description
            </label>
            < EditorMCE
              editorRef={editorRef}
              value={infoCompany.description}
              id="description"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-[#0088FF] rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white hover:bg-[#0077ee] transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </>
  );
};
