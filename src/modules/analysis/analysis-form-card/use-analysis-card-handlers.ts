import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from '@/modules/analysis/analysis-form-card/use-analysis-form'
import { trpcClient } from '@/_trpc/client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast-error'

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
            await Promise.all([utils.getReports.invalidate(), utils.getCredits.refetch()])
        })
    }

    const createReport = trpcClient.createReport.useMutation({
        onSuccess: async () => {
            refetch()
        },
    })

    const onSubmit = async (values: FormValues) => {
        try {
            await createReport.mutateAsync(values)
            resetForm()
            toast.success('Your report is being generated ☕')
            setTimeout(() => router.push('/reports'), 2000)
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
