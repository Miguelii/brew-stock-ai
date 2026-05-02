import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StockSigDev } from '@/types/ReportDTO'

type Props = {
    headline?: StockSigDev['headline']
    date?: StockSigDev['date']
}
export function ReportSigDev({ headline, date }: Props) {
    const text = headline ?? "Our AI couldn't find any recent significant development"

    const parsedDate = (item: string) => item.split('T').at(0)

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">
                    Recent Significant Development
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4 md:justify-between">
                <p
                    className={cn(
                        headline ? 'font-semibold text-primary' : 'text-muted-foreground'
                    )}
                >
                    {text}
                </p>

                {date && <p className="text-muted-foreground">{parsedDate(date)}</p>}
            </CardContent>
        </Card>
    )
}
