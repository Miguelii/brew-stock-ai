'use client'

import { BarChart2Icon, FileChartLineIcon, SearchIcon } from 'lucide-react'
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
import { MAX_STOCK_INPUT_LENGHT, PROMPT_OPTIONS } from '@/lib/constants'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
    isAuthenticated: boolean
}

export function AnalysisFormCard({ isAuthenticated }: Props) {
    const utils = trpc.useUtils()

    const router = useRouter()

    const createReport = trpc.createReport.useMutation({
        onSuccess: async () => {
            await utils.getReports.invalidate()
        },
    })

    const form = useAnalysisForm()

    const onSubmit = async (values: FormValues) => {
        try {
            await createReport.mutateAsync(values)
            resetForm()
            toast.success('Your report is being generated ☕')
            setTimeout(() => router.push('/reports'), 2000)
        } catch (error) {
            const errorCode = (error as { message?: string })?.message ?? null
            toast.error('Something went wrong.', {
                description: errorCode ? `code: ${errorCode}` : undefined,
            })
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
        <Card className="pt-0 rounded-none">
            <CardContent className="p-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col md:flex-row items-end gap-3"
                    >
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
                                                className="h-10 w-full rounded-none border border-border bg-background pl-9 pr-3 text-sm text-primary placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition uppercase"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(e.target.value.toUpperCase())
                                                }
                                                maxLength={MAX_STOCK_INPUT_LENGHT}
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
                                            <SelectTrigger className="h-10! w-full bg-background border-border text-primary rounded-none">
                                                <BarChart2Icon className="size-4 text-primary-muted shrink-0" />
                                                <SelectValue placeholder="Select type">
                                                    {PROMPT_OPTIONS.find(
                                                        (o) => o.type === field.value
                                                    )?.label ?? 'Select type'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-none">
                                                {PROMPT_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option.type}
                                                        value={option.type}
                                                    >
                                                        {option.label}
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
                            className="h-10! mt-3 ms:mt-0 w-full md:max-w-45 shrink-0 gap-2 cursor-pointer"
                            onClick={() => {
                                if (!isAuthenticated) router.push('/auth')
                            }}
                        >
                            <FileChartLineIcon className="size-4" />
                            {getButtonLabel()}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
