import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StockSigDev } from '@/types/ReportDTO'

type Props = {
    headline?: StockSigDev['headline']
    date?: StockSigDev['date']
}
export function ReportSigDev({ headline, date }: Props) {
    const text = headline ?? "Our engine couldn't find any recent significant development"

    const parsedDate = (item: string) => item.split('T').at(0)

    return (
        <Card className="h-fit">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <CardTitle className="display text-2xl">What&apos;s Happening Now</CardTitle>
                <p className="text-xs text-ink/60">
                    The most notable recent event our engine identified for this company
                </p>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4 md:justify-between">
                <p className={cn(headline ? 'font-semibold text-ink' : 'text-ink/60')}>{text}</p>

                {date && <p className="text-ink/60">{parsedDate(date)}</p>}
            </CardContent>
        </Card>
    )
}
