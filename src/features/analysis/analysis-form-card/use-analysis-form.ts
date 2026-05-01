import { MAX_STOCK_INPUT_LENGHT } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    stockSymbol: z.string().min(1, 'Required').max(MAX_STOCK_INPUT_LENGHT, 'Max 20 chars'),
    promptType: z.string().min(1, 'Required'),
})

export type FormValues = z.infer<typeof formSchema>

export const useAnalysisForm = (defaultTicker?: string) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stockSymbol: defaultTicker ?? '',
            promptType: '',
        },
    })
    return form
}
