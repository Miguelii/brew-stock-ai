import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { StockReports } from '@/types/ReportDTO'

type Props = {
    news: StockReports[]
}

export function ReportMediaMentions({ news }: Props) {
    const parsedDate = (item: string) => item.split('T').at(0)

    return (
        <Card className="h-fit">
            <CardHeader className="border-b">
                <CardTitle className="text-base font-semibold">What Experts Are Saying</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Recent reports and research from professional investors and analysts
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0 px-5">
                {news.length === 0 ? (
                    <p className="text-muted-foreground">
                        Our AI couldn&apos;t find any recent analyst coverage.
                    </p>
                ) : (
                    <ul>
                        {news.map((item, i) => (
                            <li
                                key={`${item.title}-${i}`}
                                className={cn(
                                    'not-first:py-4 first:pb-4 last:pb-0 not-last:border-b not-last:border-muted'
                                )}
                            >
                                <p className="text-sm font-semibold text-primary leading-snug">
                                    {item?.title}
                                </p>
                                <span className="text-xs text-primary mt-0.5">
                                    {item?.reportTitle}
                                </span>
                                <p className="text-xs text-muted-foreground mt-2.5">
                                    {item?.provider} · {parsedDate(item?.reportDate)}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    )
}
