import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setCSP } from '@/lib/set-csp'
import { isPathFromStaticFiles } from '@/lib/utils'
import { sbProxy } from '@/lib/utils.server'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const requestHeaders = new Headers(request.headers)

    const response = isPathFromStaticFiles(pathname)
        ? NextResponse.next({
              request: {
                  headers: requestHeaders,
              },
          })
        : await sbProxy(request)

    return setCSP(response, pathname)
}
