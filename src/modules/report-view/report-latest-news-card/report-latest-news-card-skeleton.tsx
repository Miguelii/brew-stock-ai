import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function SkeletonRow({ isLast }: { isLast: boolean }) {
    return (
        <div className={cn('flex flex-col gap-2 px-4 py-3', !isLast && 'border-b border-border')}>
            <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-2 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-8" />
        </div>
    )
}

export function ReportLatestNewsCardSkeleton() {
    return (
        <Card className="h-fit overflow-hidden">
            <CardHeader className="border-b">
                <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="p-0">
                {Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonRow key={i} isLast={i === 2} />
                ))}
            </CardContent>
        </Card>
    )
}
