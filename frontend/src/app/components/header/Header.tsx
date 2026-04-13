"use client"
import Link from "next/link";
import  {  FaBars  }  from  "react-icons/fa6"
import  {  HeaderMenu  }  from  "./HeaderMenu"
import  {  useState  }  from  "react";
import  {  HeaderAccount  }  from  "./HeaderAccount";

export const Header = () => {
  const  [showMenu, setShowMenu] = useState(false);
  
  const  handleShowMenu = () => {
    setShowMenu (!showMenu);
  }
  return (
    <>
      <header className="bg-[#000071] py-[15px]">
        <div className="contain">
          <div className="flex justify-between items-center">
            {/* Logo dự án */}
            <Link href="/" className="font-[800] sm:text-[28px] text-[20px] text-white lg:flex-none flex-1">
              28. IT Jobs
            </Link>

            {/* Điều hướng - Ẩn trên thiết bị di động (lg:hidden) */}
            <HeaderMenu showMenu = { showMenu }/>

            {/* Khu vực Đăng nhập/Đăng ký */}
            < HeaderAccount />

            {/* Nút Menu Mobile */}

            < button 
              className = "lg:hidden text-white text-[20px] ml-[12px]"
              onClick = { handleShowMenu }
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>
      < div 
        className = { " fixed top-0 left-0 w-full h-full bg-[#00000087] "  +  ( showMenu  ?  " block "  :  " hidden " ) }
        onClick = { ()  =>  setShowMenu ( false ) }
      ></ div > 
    </>
  );
};