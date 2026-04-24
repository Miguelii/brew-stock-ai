'use client'

import { Card, CardContent } from '@/components/ui/card'
import { trpc } from '@/server/trpc-client'
import { Button } from '@/components/ui/button'
import { useAuthForm, type FormValues } from './use-auth-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@base-ui/react/input'
import { useRouter } from 'next/navigation'

export function AuthCard() {
    const login = trpc.sbLogin.useMutation()

    const form = useAuthForm()

    const router = useRouter()

    const onSubmit = async (values: FormValues) => {
        console.log({ values })

        try {
            const response = await login.mutateAsync(values)

            console.log({ response })

            router.refresh()
        } catch (error) {
            console.error({ error })
        }
    }

    return (
        <Card>
            <CardContent>
                <Form {...form}>
                    <h2 className="text-lg font-semibold text-center mb-4">Welcome Back</h2>
                    <p className="text-sm text-center text-primary-muted">
                        Please sign in to your account to continue.
                    </p>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col sm:flex-row items-end gap-3"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-primary-muted">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="analytis@institution.com"
                                            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-primary placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="text-xs font-semibold uppercase tracking-widest text-primary-muted">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="******"
                                            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-primary placeholder:text-primary-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/40 focus:border-accent-blue transition uppercase"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(e.target.value.toUpperCase())
                                            }
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={login.isPending}
                            className="h-10! px-6 bg-accent-blue text-background font-semibold shrink-0 gap-2 cursor-pointer"
                        >
                            {login.isPending ? 'Signing In....' : 'Sign In'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
