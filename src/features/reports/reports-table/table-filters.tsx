'use client'

import { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../../components/ui/select'

const TYPE_OPTIONS: { value: string; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'Deep Dive', label: 'Deep Dive' },
    { value: 'Earnings Preview', label: 'Earnings Preview' },
    { value: 'Sector Scan', label: 'Sector Scan' },
]

const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
]

export function TableFilters() {
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? 'all')}>
                <SelectTrigger className="w-44 bg-card/50">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    {TYPE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'all')}>
                <SelectTrigger className="w-44 bg-card/50">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
