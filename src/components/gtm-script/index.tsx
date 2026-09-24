import { CONSENT_COOKIE, GTM_ID } from '@/_bff/core/constants/analytics.constants'
import Script from 'next/script'

const SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
});

if (document.cookie.split(';').some(function (c) { return c.trim() === '${CONSENT_COOKIE}=true' })) {
    gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted',
    });
}

gtag('config', '${GTM_ID}', {
    'cookie_prefix': 'stats',
    'cookie_flags': 'SameSite=Strict;Secure',
});
`

export function GtmScript() {
    return (
        <>
            <Script
                id="gtag-bootstrap"
                // oxlint-disable-next-line next/no-before-interactive-script-outside-document
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: SCRIPT }}
            />
            <Script
                id="gtag-loader"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
                strategy="afterInteractive"
            />
        </>
    )
}
