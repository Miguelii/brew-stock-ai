import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function TablePagination() {
    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing 4 of 24 reports</span>
            <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" disabled>
                    <ChevronLeft />
                </Button>
                <Button variant="outline" size="icon-sm">
                    <ChevronRight />
                </Button>
            </div>
        </div>
    )
}
