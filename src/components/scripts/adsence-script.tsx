import { GOOGLE_ADSENSE_ACCOUNT_ID } from '@/lib/constants'
import Script from 'next/script'

export function AdsenseScript() {
    return (
        <Script
            id="adsense"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ACCOUNT_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
        />
    )
}
