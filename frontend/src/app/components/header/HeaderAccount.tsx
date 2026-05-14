import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import  {  useRouter  }  from  "next/navigation";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany } = useAuth();

  const  router  =  useRouter ();

  const handleLogout = (url: string) => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          router.push(url);
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
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

              <ul className="bg-[#000065] rounded-[4px] absolute top-[100%] right-0 w-[200px] hidden group-hover/sub-1:block shadow-lg z-50">
                <li className="py-[10px] px-[16px] hover:bg-[#000096] rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/profile">
                    Private Information
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-[#000096] rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <Link className="font-[600] text-[16px] text-white" href="/user-manage/cv/list">
                    Submitted CVs
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] hover:bg-red-600 rounded-[4px] transition-colors group/sub-2 flex items-center justify-between">
                  <button
                    className="font-[600] text-[16px] text-white cursor-pointer w-full text-left outline-none"
                    onClick={() => handleLogout("/user/login")}
                  >
                    Log out
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
                    Company Information
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/job/list">
                    Manage Jobs
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <Link className="font-[600] text-[16px] text-white" href="/company-manage/cv/list">
                    Manage CV
                  </Link>
                </li>
                <li className="py-[10px] px-[16px] flex items-center justify-between hover:bg-[#000096] rounded-[4px] group/sub-2">
                  <button
                    className="font-[600] text-[16px] text-white cursor-pointer"
                    onClick={() => handleLogout("/company/login")}
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="font-[600] sm:text-[16px] text-[12px] text-white">
            <Link href="/user/login" className="hover:text-primary transition-colors">
              Log In
            </Link>
            <span className="mx-[5px]"> / </span>
            <Link href="/user/register" className="hover:text-primary transition-colors">
              Sign Up
            </Link>
          </div>
        </>
      )}
    </>
  );
};
