import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Gọi API kiểm tra trạng thái đăng nhập từ Server
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include", // Quan trọng: Gửi kèm Cookie chứa JWT để Server xác thực
    })
      .then((res) => {
        if(!res.ok) throw new Error("Kiểm tra xác thực thất bại");
        return res.json();
      })
      .then((data) => {
        if (data.code === "error") {
          setIsLogin(false);
          setInfoUser(null);
        }
        if(data.code == "success") {
          setIsLogin(true);
          if(data.infoUser) {
            setInfoUser(data.infoUser);
            setInfoCompany(null);
          }
          if(data.infoCompany) {
            setInfoCompany(data.infoCompany);
            setInfoUser(null);
          }
        }
      })
      .catch((err) => console.log("Lỗi kiểm tra xác thực:", err));
  }, [pathname]);
// Chạy lại mỗi khi người dùng chuyển trang để cập nhật trạng thái

  return {
    isLogin: isLogin,
    infoUser: infoUser,
    infoCompany: infoCompany
  };
};