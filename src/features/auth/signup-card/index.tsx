'use client'

import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { useSignupForm, type FormValues } from './use-signup-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import { AUTH_PAGE_PATH, HOME_PAGE_PATH } from '@/lib/constants'

export function SignupCard() {
    const signUp = trpc.signUp.useMutation()
    const form = useSignupForm()
    const router = useRouter()

    const onSubmit = async (values: FormValues) => {
        try {
            await signUp.mutateAsync({ email: values.email, password: values.password })
            toast.success('Account created!', {
                description: "You're all set. Start generating your first report.",
            })
            router.refresh()
            setTimeout(() => router.push(HOME_PAGE_PATH), 500)
        } catch (error) {
            const errorCode = (error as { message?: string })?.message ?? null
            toast.error('Something went wrong.', {
                description: errorCode ? `code: ${errorCode}` : undefined,
            })
        }
    }

    return (
        <div className="w-full max-w-sm flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Get started</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Create a new account</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel className="text-muted-foreground capitalize">
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        {...field}
                                        className="h-9 rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel className="text-muted-foreground capitalize">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        {...field}
                                        className="h-9 rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="gap-1.5">
                                <FormLabel className="text-muted-foreground capitalize">
                                    Confirm password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        {...field}
                                        className="h-9 rounded-none"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={signUp.isPending}
                        className="w-full h-11 mt-1 bg-accent-blue hover:bg-accent-blue-dark text-background font-medium rounded-none cursor-pointer"
                    >
                        {signUp.isPending ? <Loader2Icon className="animate-spin" /> : null}
                        Sign up
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href={AUTH_PAGE_PATH} className="text-primary font-medium underline">
                    Sign in
                </Link>
            </p>
        </div>
    )
}
