import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Đổi tên hàm từ 'middleware' thành 'proxy'
export function proxy(request: NextRequest) {
  // 1. Lấy token từ Cookie của request
  const token = request.cookies.get('token')?.value;

  // 2. Kiểm tra sự tồn tại của token
  if (token) {
    // Nếu có token, cho phép truy cập tiếp tục
    return NextResponse.next();
  } else {
    // Nếu không có token, điều hướng về trang chủ
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Giữ nguyên phần config
export const config = {
  matcher: [
    '/company-manage/:path*',
    '/user-manage/:path*',
  ],
};