import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Hills } from '@/components/scene/hills'
import { cn } from '@/lib/utils'
import type { StockSigDev } from '@/types/ReportDTO'
import { formatEventAge, getCalendarParts, getDayDiff } from '@/_bff/core/utils/event-dates.utils'

type Props = {
    headline?: StockSigDev['headline']
    date?: StockSigDev['date']
}

type CalendarTileProps = {
    date: string
}

type LiveDotProps = {
    isLive: boolean
}

const RECENT_EVENT_DAYS = 7

export function ReportSigDev({ headline, date }: Props) {
    const eventAgeDays = date ? getDayDiff(date, new Date().toISOString()) : null

    return (
        <Card
            data-tone="navy"
            className="relative isolate h-fit gap-0 border-transparent bg-tone text-tone-ink"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 -z-10"
            >
                <div className="h-16 text-tone-ink/8">
                    <Hills variant="back" fill="currentColor" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-10 text-tone-ink/12">
                    <Hills variant="front" fill="currentColor" />
                </div>
            </div>

            <CardHeader className="border-b-2 border-tone-ink/10 pb-4">
                <CardTitle className="display text-2xl">What&apos;s Happening Now</CardTitle>
                <CardDescription className="text-xs text-tone-ink/60">
                    The most notable recent event our engine identified for this company
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 pb-14">
                {headline ? (
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                        {date && <CalendarTile date={date} />}

                        <div className="flex min-w-0 flex-col gap-3">
                            <p className="eyebrow flex flex-wrap items-center gap-x-2 text-xs text-tone-ink/70">
                                <LiveDot
                                    isLive={
                                        eventAgeDays !== null && eventAgeDays <= RECENT_EVENT_DAYS
                                    }
                                />
                                <span>Latest development</span>
                                {eventAgeDays !== null && (
                                    <>
                                        <span aria-hidden="true">·</span>
                                        <span>{formatEventAge(eventAgeDays)}</span>
                                    </>
                                )}
                            </p>

                            <p
                                data-testid="sig-dev-headline"
                                className="text-2xl leading-tight font-bold text-balance text-tone-ink md:text-3xl"
                            >
                                {headline}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div data-testid="sig-dev-empty" className="flex flex-col gap-3">
                        <p className="eyebrow flex items-center gap-2 text-xs text-tone-ink/70">
                            <LiveDot isLive={false} />
                            No recent developments
                        </p>
                        <p className="text-lg text-tone-ink/70">
                            Our engine couldn&apos;t find any recent significant development
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function CalendarTile({ date }: CalendarTileProps) {
    const { month, day, year } = getCalendarParts(date)

    return (
        <time
            data-testid="sig-dev-calendar"
            dateTime={date}
            className="flex w-28 shrink-0 flex-col items-center rounded-[var(--radius-surface-inner)] bg-amber-soft px-3 py-3 text-amber-deep"
        >
            <span className="eyebrow text-xs">{month}</span>
            <span className="display text-6xl text-navy">{day}</span>
            <span className="text-xs font-semibold">{year}</span>
        </time>
    )
}

// Pulses only for recent events, so an old development never reads as breaking news
function LiveDot({ isLive }: LiveDotProps) {
    return (
        <span aria-hidden="true" className="relative flex size-2">
            {isLive && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber opacity-75 motion-reduce:animate-none" />
            )}
            <span
                className={cn(
                    'relative inline-flex size-2 rounded-full',
                    isLive ? 'bg-amber' : 'bg-tone-ink/40'
                )}
            />
        </span>
    )
}
