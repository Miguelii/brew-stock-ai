'use client'

import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { useTransition } from 'react'

export function ReportExport() {
    const [isPending, startTransition] = useTransition()

    function exportPDF() {
        startTransition(async () => {
            //TODO
        })
    }

    return (
        <Button
            variant="outline"
            size="lg"
            className="cursor-pointer bg-card rounded-none w-fit"
            onClick={() => exportPDF()}
        >
            <DownloadIcon />
            Export PDF
        </Button>
    )
}
