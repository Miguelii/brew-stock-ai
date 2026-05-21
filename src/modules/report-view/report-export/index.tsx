'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/server/trpc-client'
import { DownloadIcon, Loader2Icon } from 'lucide-react'
import { toastError } from '@/lib/toast-error'

type Props = {
    reportId: string
}

export function ReportExport({ reportId }: Props) {
    const exportMutation = trpc.exportReport.useMutation({
        onSuccess: ({ pdf, stock }) => {
            const bytes = Uint8Array.from(atob(pdf), (c) => c.codePointAt(0) ?? 0)
            const blob = new Blob([bytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${stock}-analysis.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        },
        onError: (error) => {
            toastError('Failed to export PDF.', error, 'Please try again later.')
        },
    })

    return (
        <Button
            variant="outline"
            size="lg"
            className="cursor-pointer bg-card rounded-none w-full md:w-fit md:min-w-31.25"
            onClick={() => exportMutation.mutate({ id: reportId })}
            disabled={exportMutation.isPending}
        >
            {exportMutation.isPending ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
            {exportMutation.isPending ? 'Generating...' : 'Export PDF'}
        </Button>
    )
}
