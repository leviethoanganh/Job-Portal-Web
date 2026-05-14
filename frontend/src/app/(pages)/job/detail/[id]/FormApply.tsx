"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import { Toaster, toast } from 'sonner';

export const FormApply = (props: { jobId: string }) => {
    const { jobId } = props;

    useEffect(() => {
        const validator = new JustValidate("#applyForm");

        validator
            .addField('#fullName', [
                {
                    rule: 'required',
                    errorMessage: 'Please enter your full name!'
                },
                {
                    rule: 'minLength',
                    value: 5,
                    errorMessage: 'Full name must be at least 5 characters!'
                },
                {
                    rule: 'maxLength',
                    value: 50,
                    errorMessage: 'Full name must not exceed 50 characters!'
                },
            ])
            .addField('#email', [
                {
                    rule: 'required',
                    errorMessage: 'Please enter your email!'
                },
                {
                    rule: 'email',
                    errorMessage: 'Invalid email format!'
                },
            ])
            .addField('#phone', [
                {
                    rule: 'required',
                    errorMessage: 'Please enter your phone number!'
                },
                {
                    rule: 'customRegexp',
                    value: /(84|0[3|5|7|8|9])([0-9]{8})\b/g,
                    errorMessage: 'Invalid phone number format!'
                },
            ])
            .addField('#fileCV', [
                {
                    rule: 'required',
                    errorMessage: 'Please select a CV file!'
                },
                {
                    validator: (value: any, fields: any) => {
                        const file = (document.getElementById('fileCV') as HTMLInputElement)?.files?.[0];
                        if (!file) return false;
                        return file.type === 'application/pdf';
                    },
                    errorMessage: 'File must be in PDF format!'
                },
                {
                    validator: (value: any, fields: any) => {
                        const file = (document.getElementById('fileCV') as HTMLInputElement)?.files?.[0];
                        if (!file) return false;
                        return file.size <= 5 * 1024 * 1024; // 5MB
                    },
                    errorMessage: 'Maximum file size is 5MB!'
                },
            ])
            .onSuccess((event: any) => {
                const form = event.target;
                const formData = new FormData();

                formData.append("jobId", jobId);
                formData.append("fullName", form.fullName.value);
                formData.append("email", form.email.value);
                formData.append("phone", form.phone.value);
                formData.append("fileCV", form.fileCV.files[0]);

                fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/apply`, {
                    method: "POST",
                    body: formData
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code === "error") {
                            toast.error(data.message);
                        }
                        if (data.code === "success") {
                            toast.success(data.message);
                            form.reset();
                            validator.refresh();
                        }
                    })
                    .catch(() => {
                        toast.error("Request failed. Please try again!");
                    });
            });

        return () => {
            validator.destroy();
        };
    }, [jobId]);

    return (
        <>
            <Toaster richColors position="top-right" />
            <form action="" id="applyForm" className="space-y-[15px]">
                <div>
                    <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
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
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Phone Number *
                    </label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="w-[100%] h-[46px] border border-[#DEDEDE] rounded-[4px] px-[20px] font-[500] text-[14px] text-black focus:border-primary outline-none"
                    />
                </div>

                <div>
                    <label htmlFor="fileCV" className="block font-[500] text-[14px] text-black mb-[5px]">
                        CV File (PDF) *
                    </label>
                    <input
                        type="file"
                        name="fileCV"
                        id="fileCV"
                        accept="application/pdf"
                        className="text-[14px]"
                    />
                </div>

                <button type="submit" className="w-[100%] h-[48px] rounded-[4px] bg-primary font-[700] text-[16px] text-white hover:opacity-90 transition-all">
                    Submit CV Application
                </button>
            </form>
        </>
    );
};
