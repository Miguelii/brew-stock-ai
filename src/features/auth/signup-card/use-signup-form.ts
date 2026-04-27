import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
    .object({
        email: z.email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type FormValues = z.infer<typeof formSchema>

export const useSignupForm = () =>
    useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '', confirmPassword: '' },
    })
