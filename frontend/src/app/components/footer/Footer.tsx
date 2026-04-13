export const Footer = () => {
  return (
    <>
      <footer className="bg-[#000065] py-[24px] border-t border-[#ffffff1a]">
        <div className="contain">
          {/* Logo Footer - Giữ nguyên font-weight 800 để đồng bộ với Header */}
          <div className="font-[800] text-[28px] text-white text-center mb-[10px]">
            28.ITJobs
          </div>

          {/* Dòng bản quyền - Sử dụng màu xám #A6A6A6 để tạo độ tương phản nhẹ */}
          <div className="font-[400] text-[14px] text-[#A6A6A6] text-center">
            Copyright © 28.ITJobs
          </div>
        </div>
      </footer>
    </>
  );
};