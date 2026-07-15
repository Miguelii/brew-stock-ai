'use client'

import { useEffect } from 'react'
import { ADS_ENABLED, GOOGLE_ADSENSE_ACCOUNT_ID } from '@/lib/constants'

type Props = {
    slot: string
    format?: 'auto' | 'rectangle' | 'horizontal'
    className?: string
}

export function AdBlock({ slot, format = 'auto', className }: Props) {
    useEffect(() => {
        if (!ADS_ENABLED) return

        try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
            // adsbygoogle script not yet loaded
        }
    }, [])

    if (!ADS_ENABLED || slot.startsWith('REPLACE_WITH')) return null

    return (
        <div className={className}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={GOOGLE_ADSENSE_ACCOUNT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    )
}
