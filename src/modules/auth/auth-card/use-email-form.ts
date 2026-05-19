import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    email: z.email('Invalid email address'),
})

export type EmailFormValues = z.infer<typeof formSchema>

export const useEmailForm = () =>
    useForm<EmailFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '' },
    })
