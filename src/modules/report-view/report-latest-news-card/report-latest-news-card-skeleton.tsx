import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const LIST_ROWS = 4

export function ReportLatestNewsCardSkeleton() {
    return (
        <Card className="h-fit gap-0">
            <CardHeader className="border-b-2 border-ink/8 pb-4">
                <Skeleton className="h-6 w-64 max-w-full" />
                <Skeleton className="h-3 w-80 max-w-full" />
            </CardHeader>

            <CardContent className="pt-4">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="aspect-[2/1] w-full rounded-[var(--radius-surface-inner)]" />
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="mt-1 h-3 w-full" />
                            <Skeleton className="h-3 w-5/6" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="border-b-2 border-ink/8 pb-2">
                            <Skeleton className="h-3 w-28" />
                        </div>
                        {Array.from({ length: LIST_ROWS }).map((_, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-ink/10 py-3 not-last:border-b"
                            >
                                <Skeleton className="h-3 w-4" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-2.5 w-24" />
                                    <Skeleton className="h-3.5 w-full" />
                                    <Skeleton className="h-3.5 w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
