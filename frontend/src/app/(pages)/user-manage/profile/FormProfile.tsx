"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import JustValidate from "just-validate";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { Toaster, toast } from 'sonner';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginImagePreview);

export const FormProfile = () => {
  const { infoUser } = useAuth();
  const [avatars, setAvatars] = useState<any[]>([]);
  const validatorRef = useRef<any>(null);

  useEffect(() => {
    if (!infoUser) return;

    if (infoUser.avatar) {
      setAvatars([{ source: infoUser.avatar }]);
    }

    const validator = new JustValidate('#profileForm', {
        validateBeforeSubmitting: true,
    });

    validator
      .addField("#fullName", [
        { rule: "required", errorMessage: "Please enter your full name!" },
        { rule: 'minLength', value: 5, errorMessage: "Must be at least 5 characters!" },
        { rule: 'maxLength', value: 50, errorMessage: "Must be at most 50 characters!" },
      ])
      .addField("#email", [
        { rule: "required", errorMessage: "Please enter your email!" },
        { rule: "email", errorMessage: "Invalid email format!" },
      ]);

    validatorRef.current = validator;

    return () => {
        if (validatorRef.current) {
            validatorRef.current.destroy();
        }
    };
  }, [infoUser]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validatorRef.current) {
      validatorRef.current.revalidate().then((isValid: boolean) => {
        if (!isValid) return;

        const target = event.target as any;
        const formData = new FormData();
        formData.append("fullName", target.fullName.value);
        formData.append("email", target.email.value);
        formData.append("phone", target.phone.value);

        if (avatars.length > 0 && avatars[0].file) {
          formData.append("avatar", avatars[0].file);
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
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
          .catch(() => toast.error("A system error occurred!"));
      });
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      {infoUser && (
        <form
          className="grid sm:grid-cols-2 grid-cols-1 gap-x-[20px] gap-y-[15px]"
          id="profileForm"
          onSubmit={handleSubmit}
        >
          <div className="sm:col-span-2">
            <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
              defaultValue={infoUser.fullName}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="avatar" className="block font-[500] text-[14px] text-black mb-[5px]">
              Avatar
            </label>
            <FilePond
              name="avatar"
              labelIdle='Drag & drop or <span class="filepond--label-action">Choose image</span>'
              acceptedFileTypes={['image/*']}
              files={avatars}
              onupdatefiles={setAvatars}
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
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
              defaultValue={infoUser.email}
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
              className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] py-[14px] px-[20px] font-[500] text-[14px] text-black outline-none focus:border-[#0088FF]"
              defaultValue={infoUser.phone}
            />
          </div>

          <div className="sm:col-span-2">
            <button type="submit" className="bg-[#0088FF] hover:bg-opacity-90 transition-all rounded-[4px] h-[48px] px-[20px] font-[700] text-[16px] text-white">
              Update
            </button>
          </div>
        </form>
      )}
    </>
  );
};
