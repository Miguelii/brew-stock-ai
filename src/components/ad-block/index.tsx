'use client'

import { useEffect } from 'react'
import { GOOGLE_ADSENSE_ACCOUNT_ID } from '@/lib/constants'

type Props = {
    slot: string
    format?: 'auto' | 'rectangle' | 'horizontal'
    className?: string
}

export function AdBlock({ slot, format = 'auto', className }: Props) {
    return null

    useEffect(() => {
        try {
            ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch {
            // adsbygoogle script not yet loaded
        }
    }, [])

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
