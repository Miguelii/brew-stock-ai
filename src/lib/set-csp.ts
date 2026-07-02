import type { NextResponse } from 'next/server'
import { NEXT_IMAGE_PATH, SW_PATH } from '@/lib/constants'
import { isPathFromStaticFiles } from '@/lib/utils'
import { getIsDev } from '@/lib/utils.server'

export const setCSP = (response: NextResponse, pathname: string) => {
    const csp = generateCSP()
    const staticCsp = generateStaticCSP()

    if (isPathFromStaticFiles(pathname)) {
        // Special case for PWA
        if (pathname.startsWith(SW_PATH)) {
            response.headers.set('Content-Type', 'application/javascript; charset=utf-8')
            response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
            response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'")
        } else {
            response.headers.set('Content-Security-Policy', staticCsp)

            if (pathname.startsWith(NEXT_IMAGE_PATH)) {
                response.headers.set('Cache-Control', 'public, max-age=31536000, must-revalidate')
            } else {
                // Let Next.js handle its own chunk caching
                // overriding causes stale chunk errors after deploys or HMR in Next.js 16+
            }
        }
    } else {
        response.headers.set('Content-Security-Policy', csp)
        response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }

    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'no-referrer')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    )
    response.headers.set('X-Xss-Protection', '0')

    return response
}

const generateCSP = () => {
    // 'unsafe-eval' is required by React Refresh in dev only — never ship it in production
    const devScriptSrc = getIsDev() ? " 'unsafe-eval'" : ''

    const csp = `
        default-src 'self';
        style-src 'self'
            'unsafe-inline';
        script-src 'self'
            https://*.googletagmanager.com
            https://*.google-analytics.com
            https://*.vercel-scripts.com
            'unsafe-inline'${devScriptSrc};
        img-src 'self'
            https://www.google.pt
            blob: data:
            https://*.googletagmanager.com
            https://*.google-analytics.com;
        font-src 'self';
        frame-src 'self';
        object-src 'none';
        media-src 'self';
        base-uri 'self';
        connect-src 'self'
            https://*.vercel-scripts.com
            https://*.adtrafficquality.google
            https://*.analytics.google.com
            https://*.google-analytics.com
            https://stats.g.doubleclick.net
            blob:
            https://*.googletagmanager.com;
        worker-src 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `

    return csp.replaceAll(/\s{2,}/gu, ' ').trim()
}

const generateStaticCSP = () => {
    const csp = `
        default-src 'self';
        upgrade-insecure-requests;
    `
    return csp.replaceAll(/\s{2,}/gu, ' ').trim()
}
