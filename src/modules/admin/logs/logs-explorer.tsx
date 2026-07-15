'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Drawer } from '@/components/ui/drawer'
import { LogLevelBadge } from '@/modules/admin/logs/log-level-badge'
import { LogDetailDrawer } from '@/modules/admin/logs/log-detail-drawer'
import { formatLogTimestamp } from '@/modules/admin/logs/utils'
import type { AdminLog, LogLevel } from '@/_bff/modules/admin/services/get-admin-logs.service'

type Props = {
    logs: AdminLog[]
}

type LevelFilter = LogLevel | 'all'

function countByLevel(logs: AdminLog[]): Record<LevelFilter, number> {
    const tally: Record<LevelFilter, number> = {
        all: logs.length,
        log: 0,
        info: 0,
        warn: 0,
        error: 0,
    }
    for (const log of logs) tally[log.level]++
    return tally
}

const LEVEL_FILTERS: { value: LevelFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'error', label: 'Error' },
    { value: 'warn', label: 'Warn' },
    { value: 'info', label: 'Info' },
    { value: 'log', label: 'Log' },
]

export function LogsExplorer({ logs }: Props) {
    const [activeLevel, setActiveLevel] = useState<LevelFilter>('all')
    const [selected, setSelected] = useState<AdminLog | null>(null)
    const [open, setOpen] = useState(false)

    const counts = countByLevel(logs)

    const filtered = activeLevel === 'all' ? logs : logs.filter((log) => log.level === activeLevel)

    const openLog = (log: AdminLog) => {
        setSelected(log)
        setOpen(true)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
                {LEVEL_FILTERS.map(({ value, label }) => (
                    <Button
                        key={value}
                        variant={activeLevel === value ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveLevel(value)}
                        className="rounded-none border border-border"
                    >
                        {label}
                        <span className="ml-1 tabular-nums text-muted-foreground">
                            {counts[value]}
                        </span>
                    </Button>
                ))}
            </div>

            <Card className="pt-0">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-5">Time</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Prefix</TableHead>
                                <TableHead className="pr-5">Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        onClick={() => openLog(log)}
                                        className="cursor-pointer"
                                    >
                                        <TableCell className="pl-5 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                            {formatLogTimestamp(log.created_at)}
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <LogLevelBadge level={log.level} />
                                        </TableCell>
                                        <TableCell className="py-3 font-mono text-xs">
                                            {log.prefix ?? '—'}
                                        </TableCell>
                                        <TableCell className="pr-5 py-3 text-sm">
                                            <span className="inline-block max-w-[24rem] truncate align-bottom">
                                                {log.message ?? '—'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Drawer direction="right" open={open} onOpenChange={setOpen}>
                {selected && <LogDetailDrawer log={selected} />}
            </Drawer>
        </div>
    )
}
