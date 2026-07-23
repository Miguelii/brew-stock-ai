import type { NextRequest } from 'next/server'
import { setCSP } from '@/lib/set-csp'
import { sbProxy } from '@/lib/utils.server'

export async function proxy(request: NextRequest) {
    const response = await sbProxy(request)
    return setCSP(response)
}

export const config = {
    matcher: [
        '/((?!_next|api/|assets|favicon|robots[.]txt|script|sw[.]js|apple-touch-icon|web-app-manifest|android-chrome|binaries|ads[.]txt|google65ae1c769c12f01e[.]html).*)',
    ],
}
