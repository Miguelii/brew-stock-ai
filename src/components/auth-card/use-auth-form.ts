import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
})

export type FormValues = z.infer<typeof formSchema>

export const useAuthForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    })
    return form
}
