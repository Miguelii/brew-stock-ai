import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from '@/modules/analysis/analysis-form-card/use-analysis-form'
import { trpcClient } from '@/lib/trpc'
import { createElement, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast-error'
import { RedirectProgress } from '@/modules/analysis/analysis-form-card/redirect-progress'

const REDIRECT_DELAY_MS = 2000

type Props = {
    form: UseFormReturn<FormValues>
}

export const useAnalysisCardHandlers = ({ form }: Props) => {
    const utils = trpcClient.useUtils()
    const router = useRouter()

    // oxlint-disable-next-line no-unused-vars
    const [_, startTransition] = useTransition()

    function refetch() {
        startTransition(async () => {
            await Promise.all([utils.reports.getAll.invalidate(), utils.credits.get.refetch()])
        })
    }

    const createReport = trpcClient.reports.create.useMutation({
        onSuccess: async () => {
            refetch()
        },
    })

    const onSubmit = async (values: FormValues) => {
        try {
            await createReport.mutateAsync(values)
            resetForm()
            toast.success(
                createElement(
                    'span',
                    { 'data-testid': 'report-created-toast' },
                    'Your report is being generated ☕'
                ),
                {
                    description: createElement(RedirectProgress, {
                        label: 'Redirecting to your reports...',
                        durationMs: REDIRECT_DELAY_MS,
                    }),
                    duration: REDIRECT_DELAY_MS,
                }
            )
            setTimeout(() => router.push('/reports'), REDIRECT_DELAY_MS)
        } catch (error) {
            const code = (error as { data?: { code?: string } })?.data?.code

            if (code === 'PAYMENT_REQUIRED') {
                toastError(
                    'Not enough credits.',
                    error,
                    'Purchase more credits to generate reports.'
                )
            } else if (code === 'INTERNAL_SERVER_ERROR') {
                toastError('Failed to deduct credits.', error, 'Please try again later.')
            } else {
                toastError('Something went wrong.', error, 'Please try again later.')
            }
        }
    }

    const resetForm = () => {
        form.reset()
    }

    return {
        resetForm,
        onSubmit,
        isPending: createReport.isPending,
    } as const
}
