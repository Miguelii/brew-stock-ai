import type { UseFormReturn } from 'react-hook-form'
import type { FormValues } from './use-analysis-form'
import { trpc } from '@/server/trpc-client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
    form: UseFormReturn<FormValues>
}

export const useAnalysisCardHandlers = ({ form }: Props) => {
    const utils = trpc.useUtils()
    const router = useRouter()

    // oxlint-disable-next-line no-unused-vars
    const [_, startTransition] = useTransition()

    function refetch() {
        startTransition(async () => {
            await Promise.all([utils.getReports.invalidate(), utils.getCredits.refetch()])
        })
    }

    const createReport = trpc.createReport.useMutation({
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

    return {
        resetForm,
        onSubmit,
        isPending: createReport.isPending,
    } as const
}
