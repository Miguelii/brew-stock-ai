'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/server/trpc-client'
import { DownloadIcon, Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
    reportId: string
}

export function ReportExport({ reportId }: Props) {
    const exportMutation = trpc.exportReport.useMutation({
        onSuccess: ({ pdf, stock }) => {
            const bytes = Buffer.from(pdf, 'base64')
            const blob = new Blob([bytes], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${stock}-analysis.pdf`
            a.click()
            URL.revokeObjectURL(url)
        },
        onError: () => {
            toast.error('Failed to export PDF. Please try again.')
        },
    })

    return (
        <Button
            variant="outline"
            size="lg"
            className="cursor-pointer bg-card rounded-none w-fit disabled:opacity-50"
            onClick={() => exportMutation.mutate({ id: reportId })}
            disabled={exportMutation.isPending}
        >
            {exportMutation.isPending ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
            {exportMutation.isPending ? 'Generating...' : 'Export PDF'}
        </Button>
    )
}
