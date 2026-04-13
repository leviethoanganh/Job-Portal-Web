"use client";

import JustValidate from "just-validate";
import { useEffect } from "react";
import { Toaster, toast } from 'sonner'; // Sửa từ 'sound' thành 'sonner' (thư viện phổ biến đi kèm richColors)

export const FormApply = (props: { jobId: string }) => {
    const { jobId } = props;

    useEffect(() => {
        const validator = new JustValidate("#applyForm");

        validator
            .addField('#fullName', [
                {
                    rule: 'required',
                    errorMessage: 'Vui lòng nhập họ tên!'
                },
                {
                    rule: 'minLength',
                    value: 5,
                    errorMessage: 'Họ tên phải có ít nhất 5 ký tự!'
                },
                {
                    rule: 'maxLength',
                    value: 50,
                    errorMessage: 'Họ tên không được vượt quá 50 ký tự!'
                },
            ])
            .addField('#email', [
                {
                    rule: 'required',
                    errorMessage: 'Vui lòng nhập email của bạn!'
                },
                {
                    rule: 'email',
                    errorMessage: 'Email không đúng định dạng!'
                },
            ])
            .addField('#phone', [
                {
                    rule: 'required',
                    errorMessage: 'Vui lòng nhập số điện thoại!'
                },
                {
                    rule: 'customRegexp',
                    value: /(84|0[3|5|7|8|9])([0-9]{8})\b/g, // Sửa lại Regex một chút cho chuẩn
                    errorMessage: 'Số điện thoại không đúng định dạng!'
                },
            ])
            .addField('#fileCV', [
                {
                    rule: 'required',
                    errorMessage: 'Vui lòng chọn file CV!'
                },
                {
                    validator: (value: any, fields: any) => {
                        const file = (document.getElementById('fileCV') as HTMLInputElement)?.files?.[0];
                        if (!file) return false;
                        return file.type === 'application/pdf';
                    },
                    errorMessage: 'File phải là định dạng PDF!'
                },
                {
                    validator: (value: any, fields: any) => {
                        const file = (document.getElementById('fileCV') as HTMLInputElement)?.files?.[0];
                        if (!file) return false;
                        return file.size <= 5 * 1024 * 1024; // 5MB
                    },
                    errorMessage: 'Dung lượng file tối đa là 5MB!'
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
                            validator.refresh(); // Làm mới validator sau khi reset form
                        }
                    })
                    .catch(() => {
                        toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại!");
                    });
            });

        return () => {
            validator.destroy(); // Dọn dẹp validator khi component bị unmount
        };
    }, [jobId]);

    return (
        <>
            <Toaster richColors position="top-right" />
            <form action="" id="applyForm" className="space-y-[15px]">
                <div>
                    <label htmlFor="fullName" className="block font-[500] text-[14px] text-black mb-[5px]">
                        Họ tên *
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
                        Số điện thoại *
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
                        File CV (PDF) *
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
                    Gửi CV ứng tuyển
                </button>
            </form>
        </>
    );
};