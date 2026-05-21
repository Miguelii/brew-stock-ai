import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ReportsIdLoading() {
    return (
        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Skeleton className="h-8 w-20" />

                <div className="flex flex-col gap-6 md:gap-0 items-start md:flex-row w-full justify-between md:items-center">
                    <div className="space-y-1">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>

            {/* Section nav */}
            <div className="sticky top-16.25 z-80 bg-background border-b -mx-px w-[calc(100%+2px)]">
                <div className="max-w-8xl mx-auto px-6">
                    <div className="flex flex-wrap gap-1 py-2">
                        {[20, 24, 20, 20, 32, 28].map((w, i) => (
                            <Skeleton key={i} className={`h-8 w-${w}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Overview */}
            <section>
                <div className="flex flex-col md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] gap-6">
                    <Card>
                        <CardHeader className="border-b">
                            <Skeleton className="h-5 w-16" />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 pt-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>

                    <Card className="h-79 md:h-full w-full">
                        <CardHeader className="border-b">
                            <Skeleton className="h-5 w-36" />
                        </CardHeader>
                        <CardContent className="flex items-center justify-center pt-6">
                            <Skeleton className="size-40 rounded-full" />
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Key Metrics */}
            <section>
                <Card className="h-fit">
                    <CardHeader className="border-b">
                        <Skeleton className="h-5 w-44" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-28" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-44" />
                            <div className="grid grid-cols-3 gap-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16" />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-44" />
                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16" />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-3 w-36" />
                            <div className="grid grid-cols-4 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-16" />
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Analysis */}
            <section>
                <Card>
                    <CardHeader className="border-b">
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            </section>

            {/* Significant Developments */}
            <section>
                <Card>
                    <CardHeader className="border-b">
                        <Skeleton className="h-5 w-48" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            </section>

            {/* Latest News */}
            <section>
                <Card>
                    <CardHeader className="border-b">
                        <Skeleton className="h-5 w-36" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 pt-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>

            {/* Sector Scores */}
            <section>
                <Card className="h-fit">
                    <CardHeader className="border-b">
                        <Skeleton className="h-5 w-52" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <Skeleton className="h-4 w-full" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-3 w-full rounded-full" />
                            </div>
                        ))}
                        <div className="flex items-center justify-center gap-4">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}
