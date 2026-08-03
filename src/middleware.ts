import { NextResponse } from 'next/server'
export function middleware() {
  return NextResponse.next()
}
export const config = {
  matcher: ['/non-existent-path-to-disable-middleware'],
}
