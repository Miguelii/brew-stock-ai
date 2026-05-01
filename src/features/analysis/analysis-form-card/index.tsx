'use client'

import { BarChart2Icon, ClockIcon, CoinsIcon, FileChartLineIcon, SearchIcon } from 'lucide-react'
import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useAnalysisForm, type FormValues } from './use-analysis-form'
import { Input } from '@/components/ui/input'
import { AUTH_PAGE_PATH, MAX_STOCK_INPUT_LENGHT, PROMPT_OPTIONS } from '@/lib/constants'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
    isAuthenticated: boolean
    defaultTicker?: string
}

export function AnalysisFormCard({ isAuthenticated, defaultTicker }: Props) {
    const utils = trpc.useUtils()

    const router = useRouter()
    const pathname = usePathname()

    const createReport = trpc.createReport.useMutation({
        onSuccess: async () => {
            await utils.getReports.invalidate()
        },
    })

    const form = useAnalysisForm(defaultTicker)

    const onSubmit = async (values: FormValues) => {
        try {
            await createReport.mutateAsync(values)
            resetForm()
            toast.success('Your report is being generated ☕')
            setTimeout(() => router.push('/reports'), 2000)
        } catch (error) {
            const code = (error as { data?: { code?: string } })?.data?.code

            if (code === 'PAYMENT_REQUIRED') {
                toast.error('Not enough credits.', {
                    description: 'Purchase more credits to generate reports.',
                })
            } else if (code === 'INTERNAL_SERVER_ERROR') {
                toast.error('Failed to deduct credits. Please try again.')
            } else {
                toast.error('Something went wrong. Please try again.')
            }
        }
    }

    const resetForm = () => {
        form.reset()
    }

    const getButtonLabel = () => {
        if (!isAuthenticated) return 'Sign In to generate'
        return createReport.isPending ? 'Generating...' : 'Generate Report'
    }

    return (
        <Card className="pt-0 drop-shadow-md w-full lg:w-[43%]">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="stockSymbol"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-primary-muted">
                                        Company Ticker
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary-muted pointer-events-none" />
                                            <Input
                                                placeholder="Enter AAPL, TSLA, etc."
                                                className="h-10 w-full border border-border bg-background pl-9 pr-3 text-sm text-primary placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition uppercase"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.toUpperCase())
                                                }
                                                maxLength={MAX_STOCK_INPUT_LENGHT}
                                                disabled={defaultTicker != null}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="promptType"
                            render={({ field }) => (
                                <FormItem className="w-full sm:min-w-[10%]">
                                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-primary-muted">
                                        Analysis Type
                                    </FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                aria-label="Analysis Type"
                                                className="h-10! w-full bg-background border-border text-primary rounded-none"
                                            >
                                                <BarChart2Icon
                                                    aria-hidden="true"
                                                    className="size-4 text-primary-muted shrink-0"
                                                />
                                                <SelectValue placeholder="Select type">
                                                    {(() => {
                                                        const selected = PROMPT_OPTIONS.find(
                                                            (o) => o.type === field.value
                                                        )
                                                        if (!selected) return 'Select type'
                                                        return (
                                                            <span className="flex items-center gap-2">
                                                                <span className="truncate">
                                                                    {selected.label}
                                                                </span>
                                                                <span className="flex items-center gap-0.5 text-xs text-accent-blue font-semibold shrink-0">
                                                                    <CoinsIcon
                                                                        aria-hidden="true"
                                                                        className="size-3"
                                                                    />
                                                                    <span>
                                                                        {selected.cost} credits
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        )
                                                    })()}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                {PROMPT_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option.type}
                                                        value={option.type}
                                                        className="px-3"
                                                    >
                                                        <span className="flex items-center justify-between gap-4 w-full">
                                                            <span>{option.label}</span>
                                                            <span className="flex items-center gap-0.5 text-xs text-accent-blue font-semibold shrink-0">
                                                                <CoinsIcon
                                                                    aria-hidden="true"
                                                                    className="size-3"
                                                                />
                                                                <span>{option.cost} credits</span>
                                                            </span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type={isAuthenticated ? 'submit' : 'button'}
                            disabled={createReport.isPending}
                            className="h-11! w-full gap-2 cursor-pointer"
                            onClick={() => {
                                if (!isAuthenticated)
                                    router.push(
                                        `${AUTH_PAGE_PATH}?returnTo=${encodeURIComponent(pathname)}`
                                    )
                            }}
                        >
                            <FileChartLineIcon className="size-4" />
                            {getButtonLabel()}
                        </Button>
                    </form>
                </Form>
                <p className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                    <ClockIcon className="size-3 shrink-0" />
                    AI analysis runs in the background and typically takes 30s - 1 min.
                </p>
            </CardContent>
        </Card>
    )
}
