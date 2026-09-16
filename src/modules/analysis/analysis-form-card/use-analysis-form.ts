import {
    MAX_STOCK_INPUT_LENGTH,
    STOCK_INPUT_PATTERN,
} from '@/_bff/core/constants/stock-input.constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    stockSymbol: z
        .string()
        .trim()
        .min(1, 'Required')
        .max(MAX_STOCK_INPUT_LENGTH, `Max ${MAX_STOCK_INPUT_LENGTH} chars`)
        .regex(STOCK_INPUT_PATTERN, "Only letters, numbers and . , ' & ^ - are allowed"),
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
