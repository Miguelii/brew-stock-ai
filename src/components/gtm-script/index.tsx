import { GTM_ID } from '@/lib/constants'
import Script from 'next/script'

export function GtmScript() {
    return (
        <>
            <Script
                id="gtm-script"
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
                strategy="lazyOnload"
            />
            <Script
                id="google-analytics"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());

                    gtag('consent', 'default', {
                        'ad_storage': 'denied',
                        'analytics_storage': 'denied',
                    });

                    gtag('config', '${GTM_ID}', { 
                        'cookie_prefix': 'stats',
                        'cookie_flags': 'SameSite=Strict;Secure',
                    });
				`,
                }}
            />
        </>
    )
}
