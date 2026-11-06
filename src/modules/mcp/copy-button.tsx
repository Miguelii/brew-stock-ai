'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
    value: string
    className?: string
}

const COPIED_RESET_MS = 1500

export function CopyButton({ value, className }: Props) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), COPIED_RESET_MS)
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            className={cn(
                'text-paper/60 hover:bg-paper/10 hover:text-paper dark:hover:bg-paper/10',
                className
            )}
        >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
    )
}
