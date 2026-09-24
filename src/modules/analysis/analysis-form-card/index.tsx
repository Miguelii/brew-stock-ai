'use client'

import {
    BarChart2Icon,
    ClockIcon,
    CoinsIcon,
    FileChartLineIcon,
    Loader2,
    SearchIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useAnalysisForm } from '@/modules/analysis/analysis-form-card/use-analysis-form'
import { Input } from '@/components/ui/input'
import { AUTH_PAGE_PATH } from '@/lib/constants'
import { MAX_STOCK_INPUT_LENGTH } from '@/_bff/core/constants/stock-input.constants'
import { PROMPT_OPTIONS } from '@/_bff/core/constants/prompt-types.constants'
import { useAnalysisCardHandlers } from '@/modules/analysis/analysis-form-card/use-analysis-card-handlers'
import { useGetCredits } from '@/hooks/use-get-credits'
import { cn, pluralizeCredits } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
    isAuthenticated: boolean
    defaultTicker?: string
    isMaintenance: boolean
}

export function AnalysisFormCard({ isAuthenticated, defaultTicker, isMaintenance }: Props) {
    const router = useRouter()
    const pathname = usePathname()

    const form = useAnalysisForm(defaultTicker)

    const { onSubmit, isPending } = useAnalysisCardHandlers({ form })
    const {
        credits,
        isLoading: creditsLoading,
        isSuccess: creditsSuccess,
    } = useGetCredits({
        enabled: isAuthenticated,
    })
    const hasNoCredits = isAuthenticated && !creditsLoading && creditsSuccess && credits === 0

    const getButtonLabel = () => {
        if (!isAuthenticated) {
            return (
                <>
                    <FileChartLineIcon className="size-4" />
                    Sign In to generate
                </>
            )
        }

        if (hasNoCredits) {
            return (
                <>
                    <CoinsIcon className="size-4" />
                    Buy credits to generate
                </>
            )
        }

        if (isPending) {
            return (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Generating...
                </>
            )
        }

        return (
            <>
                <FileChartLineIcon className="size-4" />
                Generate Report
            </>
        )
    }

    return (
        <Card className="w-full gap-0 border border-ink/10 bg-card py-0">
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="stockSymbol"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="eyebrow text-ink/50">
                                        Company Ticker
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <SearchIcon
                                                className={cn(
                                                    'pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2',
                                                    field.value ? 'text-ink' : 'text-ink/40'
                                                )}
                                            />
                                            <Input
                                                data-testid="ticker-input"
                                                placeholder="Enter AAPL, TSLA, etc."
                                                className="h-12 w-full rounded-full border border-border bg-paper pr-4 pl-11 text-sm font-semibold tracking-wide text-ink uppercase transition placeholder:font-normal placeholder:tracking-normal placeholder:text-ink/40 focus:border-blue focus:ring-2 focus:ring-blue/25 focus:outline-none"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.toUpperCase())
                                                }
                                                maxLength={MAX_STOCK_INPUT_LENGTH}
                                                disabled={defaultTicker != null}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="promptType"
                            render={({ field }) => (
                                <FormItem className="w-full sm:min-w-[10%]">
                                    <FormLabel className="eyebrow text-ink/50">
                                        Analysis Type
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                data-testid="analysis-type-select"
                                                aria-label="Analysis Type"
                                                className="h-12! w-full rounded-full border-border bg-paper px-4 text-ink"
                                            >
                                                <BarChart2Icon
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'size-4 shrink-0',
                                                        field.value ? 'text-ink' : 'text-ink/40'
                                                    )}
                                                />
                                                <SelectValue>
                                                    {(() => {
                                                        const selected = PROMPT_OPTIONS.find(
                                                            (o) => o.type === field.value
                                                        )
                                                        if (!selected)
                                                            return (
                                                                <span className="text-ink/40">
                                                                    Select type
                                                                </span>
                                                            )
                                                        return (
                                                            <span className="flex items-center gap-2">
                                                                <span className="truncate">
                                                                    {selected.label}
                                                                </span>
                                                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue">
                                                                    <CoinsIcon
                                                                        aria-hidden="true"
                                                                        className="size-3"
                                                                    />
                                                                    <span>
                                                                        {selected.cost}{' '}
                                                                        {pluralizeCredits(
                                                                            selected.cost
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        )
                                                    })()}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-[var(--radius-surface-inner)]">
                                                {PROMPT_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option.type}
                                                        data-testid="analysis-type-option"
                                                        value={option.type}
                                                        className="rounded-full px-3"
                                                    >
                                                        <span className="flex items-center justify-between gap-4 w-full">
                                                            <span>{option.label}</span>
                                                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-blue/10 px-2 py-0.5 font-mono text-[11px] font-medium text-blue">
                                                                <CoinsIcon
                                                                    aria-hidden="true"
                                                                    className="size-3"
                                                                />
                                                                <span>
                                                                    {option.cost}{' '}
                                                                    {pluralizeCredits(option.cost)}
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            data-testid="generate-report-button"
                            type={isAuthenticated && !hasNoCredits ? 'submit' : 'button'}
                            disabled={isMaintenance || isPending}
                            size="xl"
                            className={cn(
                                'w-full cursor-pointer',
                                isMaintenance
                                    ? 'cursor-not-allowed! opacity-60! disabled:bg-accent-blue/50!'
                                    : ''
                            )}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    router.push(
                                        `${AUTH_PAGE_PATH}?returnTo=${encodeURIComponent(pathname)}`
                                    )
                                } else if (hasNoCredits) {
                                    router.push('/tokens')
                                }
                            }}
                        >
                            {getButtonLabel()}
                        </Button>
                        {isMaintenance ? (
                            <p className="text-center font-mono text-[13px] text-ink/50">
                                Temporarily unavailable for maintenance.
                            </p>
                        ) : null}
                    </form>
                </Form>
                {!isMaintenance ? (
                    <p className="mt-4 flex items-center gap-1.5 font-mono text-[13px] leading-snug text-ink/50">
                        <ClockIcon className="size-3.5 shrink-0" />
                        Analysis runs in the background and typically takes ~1-2 min.
                    </p>
                ) : null}
            </CardContent>
        </Card>
    )
}
