import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [infoUser, setInfoUser] = useState<any>(null);
  const [infoCompany, setInfoCompany] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
      credentials: "include",
    })
      .then((res) => {
        if(!res.ok) throw new Error("Authentication check failed");
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
      .catch((err) => console.log("Authentication check error:", err));
  }, [pathname]);

  return {
    isLogin: isLogin,
    infoUser: infoUser,
    infoCompany: infoCompany
  };
};
