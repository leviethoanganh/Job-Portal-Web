import { Request, Response } from "express";

export const imagePost = async (req: Request, res: Response) => {
  // Trả về thuộc tính 'location' chứa URL ảnh từ Cloudinary
  // TinyMCE sẽ dùng URL này để chèn thẻ <img> vào nội dung
  res.json({
    location: req?.file?.path
  });
};