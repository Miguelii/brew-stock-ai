import type { NextResponse } from 'next/server'
import { getIsDev } from '@/lib/utils.server'

/**
 * Sets the page Content-Security-Policy and Cache-Control on a proxy response.
 * Only runs for page/document requests — static assets are excluded from the
 * proxy via matcher and get their headers from next.config.ts headers().
 * @param response - The proxy response to decorate.
 */
export const setCSP = (response: NextResponse) => {
    response.headers.set('Content-Security-Policy', generateCSP())
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')

    return response
}

const generateCSP = () => {
    // 'unsafe-eval' is only required in development (React Fast Refresh)
    const scriptEvalDirective = getIsDev() ? "'unsafe-eval'" : ''

    const csp = `
        default-src 'self';
        style-src 'self'
            'unsafe-inline';
        script-src 'self'
            https://*.google.com
            https://*.googletagmanager.com
            https://*.google-analytics.com
            https://*.vercel-scripts.com
            https://vercel.live
            https://*.googlesyndication.com
            https://*.adtrafficquality.google
            'unsafe-inline'${scriptEvalDirective};
        img-src 'self'
            https://www.google.pt
            https://*.googlesyndication.com
            https://*.adtrafficquality.google
            blob: data:
            https://*.googletagmanager.com
            https://*.google-analytics.com;
        font-src 'self';
        frame-src 'self'
            https://vercel.live
            https://*.adtrafficquality.google
            https://*.googlesyndication.com;
        object-src 'none';
        media-src 'self';
        base-uri 'self';
        connect-src 'self'
            https://*.google.com
            https://*.googlesyndication.com
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
