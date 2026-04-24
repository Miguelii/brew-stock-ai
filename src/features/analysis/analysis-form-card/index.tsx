'use client'

import { BarChart2Icon, SearchIcon, SparklesIcon } from 'lucide-react'
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

export function AnalysisFormCard() {
    const utils = trpc.useUtils()

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
        } catch (error) {
            console.error((error as { message?: string })?.message)
        }
    }

    const resetForm = () => {
        form.reset()
    }

    return (
        <Card className="border-border shadow-sm pt-0">
            <CardContent className="p-4">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col sm:flex-row items-end gap-3"
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
                                                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-primary placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition uppercase"
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
                                            <SelectTrigger className="h-10! w-full bg-background border-border text-primary">
                                                <BarChart2Icon className="size-4 text-primary-muted shrink-0" />
                                                <SelectValue placeholder="Select type">
                                                    {PROMPT_OPTIONS.find(
                                                        (o) => o.type === field.value
                                                    )?.label ?? 'Select type'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="">
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
                            type="submit"
                            disabled={createReport.isPending}
                            className="h-10! px-6 bg-accent-blue text-background font-semibold shrink-0 gap-2 cursor-pointer"
                        >
                            <SparklesIcon className="size-4" />
                            {createReport.isPending ? 'Generating...' : 'Generate Report'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
