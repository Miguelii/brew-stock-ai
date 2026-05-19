import {
    CONTACT_FORM_MAX_MESSAGE_LENGTH,
    CONTACT_FORM_MAX_NAME_LENGTH,
    CONTACT_FORM_MIN_MESSAGE_LENGTH,
} from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(CONTACT_FORM_MAX_NAME_LENGTH, `Max ${CONTACT_FORM_MAX_NAME_LENGTH} characters`),
    email: z.email('Invalid email address'),
    message: z
        .string()
        .min(
            CONTACT_FORM_MIN_MESSAGE_LENGTH,
            `Message must be at least ${CONTACT_FORM_MIN_MESSAGE_LENGTH} characters`
        )
        .max(CONTACT_FORM_MAX_MESSAGE_LENGTH, `Max ${CONTACT_FORM_MAX_MESSAGE_LENGTH} characters`),
})

export type ContactFormValues = z.infer<typeof formSchema>

export const useContactForm = () =>
    useForm<ContactFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', email: '', message: '' },
    })
