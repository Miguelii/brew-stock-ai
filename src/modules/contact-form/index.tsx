'use client'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useContactForm, type ContactFormValues } from '@/modules/contact-form/use-contact-form'
import { trpcClient } from '@/_trpc/client'
import { toast } from 'sonner'
import { toastError } from '@/lib/toast-error'
import { Loader2Icon } from 'lucide-react'
import {
    CONTACT_FORM_MAX_MESSAGE_LENGTH,
    CONTACT_FORM_MAX_NAME_LENGTH,
    CONTACT_FORM_MIN_MESSAGE_LENGTH,
} from '@/lib/constants'

type Props = {
    name?: string
    email?: string
}

export function ContactForm({ name, email }: Props) {
    const form = useContactForm({ name, email })
    const mutation = trpcClient.core.submitFeedback.useMutation()

    const onSubmit = async (values: ContactFormValues) => {
        try {
            await mutation.mutateAsync(values)
            toast.success('Message sent!', {
                description: 'Thanks for reaching out. We will reply to you as soon as possible.',
            })
            form.reset()
        } catch (error) {
            toastError('Something went wrong.', error, 'Please try again later.')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel className="text-muted-foreground">Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} disabled={!!name} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel className="text-muted-foreground">Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your email"
                                    {...field}
                                    minLength={1}
                                    maxLength={CONTACT_FORM_MAX_NAME_LENGTH}
                                    disabled={!!email}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem className="gap-1.5">
                            <FormLabel className="text-muted-foreground">Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="How can we help you?"
                                    className="min-h-40"
                                    {...field}
                                    minLength={CONTACT_FORM_MIN_MESSAGE_LENGTH}
                                    maxLength={CONTACT_FORM_MAX_MESSAGE_LENGTH}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full cursor-pointer"
                >
                    {mutation.isPending ? <Loader2Icon className="animate-spin w-3 h-3" /> : null}
                    Send message
                </Button>
            </form>
        </Form>
    )
}
