import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setCSP } from './lib/set-csp'

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const requestHeaders = new Headers(request.headers)

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    setCSP(response, pathname)

    return response
}
