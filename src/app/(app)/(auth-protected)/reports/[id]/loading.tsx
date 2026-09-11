import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

/** Tailwind cannot extract interpolated widths, so these are inline styles. */
const SKELETON_NAV_WIDTHS = ['5rem', '11rem', '9rem', '6rem', '8rem', '7rem'] as const

export default function ReportsIdLoading() {
    return (
        <main id="main" className="-mt-20">
            {/* Hero */}
            <div data-tone="navy" className="bg-tone pt-22 pb-9 lg:pt-24 lg:pb-10">
                <div className="section-shell">
                    <Skeleton className="h-10 w-28 rounded-full bg-white/15" />

                    <div className="mt-6 flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                        <div className="flex flex-col gap-4">
                            <Skeleton className="h-10 w-64 rounded-full bg-white/15" />
                            <Skeleton className="h-16 w-44 bg-white/15" />
                            <Skeleton className="h-5 w-72 bg-white/15" />
                        </div>
                        <Skeleton className="h-14 w-45 rounded-full bg-white/15" />
                    </div>
                </div>
            </div>

            {/* Section nav */}
            <div className="sticky top-0 z-40 bg-paper pt-[72px] pb-3">
                <div className="section-shell">
                    <div className="hidden w-fit rounded-full bg-card p-1.5 xl:flex xl:flex-wrap">
                        {SKELETON_NAV_WIDTHS.map((width) => (
                            <div key={width} className="px-4 py-2.5">
                                <Skeleton className="h-5" style={{ width }} />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-12 w-full rounded-full xl:hidden" />
                </div>
            </div>

            <div data-tone="paper" className="bg-tone text-tone-ink">
                <div className="section-shell flex flex-col gap-6 pt-8 pb-20 lg:pb-30">
                    {/* Overview */}
                    <section>
                        <div className="flex flex-col md:grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_350px] gap-6">
                            <Card>
                                <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                                <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                            <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                            <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                            <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                            <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                            <CardHeader className="border-b-2 border-ink/8 pb-4">
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
                </div>
            </div>
        </main>
    )
}
