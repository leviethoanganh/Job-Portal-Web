import { FormRegister } from "./FormRegister";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* Form container căn giữa với chiều rộng tối đa 602px */}
          <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto shadow-sm">
            <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">
              Đăng ký (Ứng viên)
            </h1>

            {/* Form đăng ký */}
            <FormRegister />
          </div>
        </div>
      </div>
    </>
  )
}