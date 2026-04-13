import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import  {  useRouter  }  from  "next/navigation";

export const HeaderAccount = () => {
  // Sử dụng Hook để lấy trạng thái đăng nhập và thông tin người dùng
  const { isLogin, infoUser, infoCompany } = useAuth();

  const  router  =  useRouter ();

  const handleLogout = (url: string) => {
    // 1. Gửi yêu cầu đăng xuất tới Server cổng 5000
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include", // Quan trọng: Để Server biết cần xóa Cookie của ai
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          // 2. Nếu Server xóa Cookie thành công, điều hướng ứng viên về trang chủ hoặc trang đăng nhập
          router.push(url);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi đăng xuất:", error);
      });
  };

  return (
    <>
      {isLogin ? (
        <>
          {infoUser && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1">
              <Link className="" href="/user-manage/profile">
                {infoUser.fullName}

              </Link>

              {/* Submenu xổ xuống khi hover */}
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block shadow-lg z-50">
                <li className="py-[10px] px-[16px] hover:bg-[#000096] rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/profile">
                    Thông tin cá nhân
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096] rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/cv/list">
                    Quản lý CV đã gửi
                  </Link>
                </li>
                {/* Anh có thể thêm nút Đăng xuất tại đây nếu cần */}
                <li className="py-[10px] px-[16px] hover:bg-red-600 rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <button 
                    className="font-[600] text-[16px] text-white cursor-pointer w-full text-left outline-none"
                    onClick={() => handleLogout("/user/login")}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
          
          {infoCompany && (
            <div className="font-[600] sm:text-[16px] text-[12px] text-white relative group/sub-1">
              <Link className="" href="/company-manage/profile">
                {infoCompany.companyName}
              </Link>
              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block">
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/profile">
                    Thông tin công ty
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/job/list">
                    Quản lý công việc
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/cv/list">
                    Quản lý CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button 
                    className="font-[600] text-[16px] text-white cursor-pointer"
                    onClick={() => handleLogout("/company/login")}
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Trạng thái: Chưa đăng nhập */}
          <div className="font-[600] sm:text-[16px] text-[12px] text-white">
            <Link href="/user/login" className="hover:text-primary transition-colors">
              Đăng Nhập
            </Link>
            <span className="mx-[5px]"> / </span>
            <Link href="/user/register" className="hover:text-primary transition-colors">
              Đăng Ký
            </Link>
          </div>
        </>
      )}
    </>
  );
};