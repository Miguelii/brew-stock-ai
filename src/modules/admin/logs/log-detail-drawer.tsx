'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon, XIcon } from 'lucide-react'
import {
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { LogLevelBadge } from '@/modules/admin/logs/log-level-badge'
import { formatJson, formatLogTimestamp } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { AdminLog } from '@/_backend/modules/admin/services/get-admin-logs.service'

type Props = {
    log: AdminLog
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="grid grid-cols-[7rem_1fr] gap-3 py-2 border-b border-border last:border-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </span>
            <span className={cn('text-sm break-words', mono && 'font-mono text-xs')}>{value}</span>
        </div>
    )
}

export function LogDetailDrawer({ log }: Props) {
    const [copied, setCopied] = useState(false)

    const metadataJson = formatJson(log.metadata)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(metadataJson)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <DrawerContent className="w-full data-[vaul-drawer-direction=right]:sm:max-w-xl">
            <DrawerHeader className="flex flex-row items-start justify-between gap-3 border-border">
                <div className="flex items-center gap-3">
                    <LogLevelBadge level={log.level} />
                    <div className="space-y-0.5">
                        <DrawerTitle className="font-mono text-sm">{log.prefix ?? '—'}</DrawerTitle>
                        <DrawerDescription className="font-mono text-xs">
                            {formatLogTimestamp(log.created_at)}
                        </DrawerDescription>
                    </div>
                </div>
                <DrawerClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close">
                        <XIcon className="size-4" />
                    </Button>
                </DrawerClose>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="py-2">
                    <Field label="ID" value={String(log.id)} mono />
                    <Field label="Time" value={formatLogTimestamp(log.created_at)} mono />
                    <Field label="Level" value={log.level} mono />
                    <Field label="Prefix" value={log.prefix ?? '—'} mono />
                    <Field label="Message" value={log.message ?? '—'} />
                    <Field label="User ID" value={log.user_id ?? '—'} mono />
                </div>

                <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Metadata
                        </span>
                        {log.metadata !== null && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="h-7 gap-1.5 text-xs"
                            >
                                {copied ? (
                                    <CheckIcon className="size-3" />
                                ) : (
                                    <CopyIcon className="size-3" />
                                )}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        )}
                    </div>
                    {log.metadata === null ? (
                        <p className="text-sm text-muted-foreground">No metadata.</p>
                    ) : (
                        <pre className="overflow-auto rounded-none border border-border bg-muted p-4 font-mono text-xs leading-relaxed">
                            {metadataJson}
                        </pre>
                    )}
                </div>
            </div>
        </DrawerContent>
    )
}
