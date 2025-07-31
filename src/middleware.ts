import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Có thể thêm logic tại đây
  return NextResponse.next()
}
