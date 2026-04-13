import { FormLogin } from "./FormLogin";

export default function Page() {
  return (
    <>
      <div className="py-[60px]">
        <div className="contain">
          {/* Container cho Form đăng nhập, giới hạn chiều rộng 602px để cân đối trên Desktop */}
          <div className="border border-[#DEDEDE] rounded-[8px] py-[50px] px-[20px] max-w-[602px] mx-auto shadow-sm">
            <h1 className="font-[700] text-[20px] text-black text-center mb-[20px]">
              Đăng nhập (Ứng viên)
            </h1>

            {/* Form đăng nhập */}
            <FormLogin />
          </div>
        </div>
      </div>
    </>
  )
}