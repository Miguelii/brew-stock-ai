'use client'

import { useState, useTransition } from 'react'
import { trpc } from '@/server/trpc-client'
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Separator } from '@/components/ui/separator'
import { useEmailForm, type EmailFormValues } from '@/modules/auth/auth-card/use-email-form'
import { useLastUsed } from '@/modules/auth/auth-card/use-last-used'
import { toast } from 'sonner'
import { AuthErrorHandler } from '@/modules/auth/auth-card/auth-error-handler'
import { ENABLE_OTP_LOGIN, SB_OTP_TOKEN_LENGTH, SIGN_IN_GOOGLE_API_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { LastUsedBadge } from '@/modules/auth/auth-card/last-used-badge'

type Props = {
    returnTo?: string
}

type Step = 'email' | 'otp'

export function AuthCard({ returnTo }: Props) {
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const { lastUsed, saveLastUsed } = useLastUsed()

    const [pending, startTransition] = useTransition()

    const emailForm = useEmailForm()
    const sendOtp = trpc.sendOtp.useMutation()
    const verifyOtp = trpc.verifyOtp.useMutation()

    const onOAuthClick = () => {
        const url = returnTo
            ? `${SIGN_IN_GOOGLE_API_PATH}?returnTo=${encodeURIComponent(returnTo)}`
            : SIGN_IN_GOOGLE_API_PATH

        setTimeout(() => {
            saveLastUsed('google')
        }, 1500)

        window.location.href = url
    }

    const onEmailSubmit = async (values: EmailFormValues) => {
        startTransition(async () => {
            try {
                await sendOtp.mutateAsync({ email: values.email })
                setEmail(values.email)
                setStep('otp')
            } catch {
                toast.error('Failed to send code. Please try again.')
            }
        })
    }

    const onOtpConfirm = async () => {
        startTransition(async () => {
            try {
                await verifyOtp.mutateAsync({ email, token: otp })
                saveLastUsed('email')
                window.location.href = returnTo ?? '/analysis'
            } catch {
                toast.error('Invalid code. Please try again.')
                setOtp('')
            }
        })
    }

    const onBackToEmail = () => {
        setStep('email')
        setOtp('')
    }

    return (
        <div className="w-full max-w-sm flex flex-col gap-8">
            <AuthErrorHandler />
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            {step === 'email' ? (
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        {lastUsed === 'google' && <LastUsedBadge />}
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full gap-2 cursor-pointer"
                            onClick={onOAuthClick}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </div>

                    {ENABLE_OTP_LOGIN && (
                        <>
                            <div className="flex items-center gap-3">
                                <Separator className="flex-1" />
                                <span className="text-xs text-muted-foreground">OR</span>
                                <Separator className="flex-1" />
                            </div>

                            <Form {...emailForm}>
                                <form
                                    onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                                    className="flex flex-col gap-4"
                                >
                                    <FormField
                                        control={emailForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="gap-1.5">
                                                <FormLabel className="text-muted-foreground">
                                                    Email
                                                </FormLabel>
                                                <div className="relative">
                                                    {lastUsed === 'email' && <LastUsedBadge />}
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="name@company.com"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={sendOtp.isPending}
                                        className="w-full cursor-pointer"
                                    >
                                        {sendOtp.isPending ? (
                                            <Loader2Icon className="animate-spin w-3 h-3" />
                                        ) : null}
                                        Sign in with email
                                    </Button>
                                </form>
                            </Form>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-sm text-muted-foreground">
                            We sent a {SB_OTP_TOKEN_LENGTH}-digit code to{' '}
                            <span className="text-primary font-medium">{email}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Can&apos;t find it? Check your spam folder.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <InputOTP
                            maxLength={SB_OTP_TOKEN_LENGTH}
                            value={otp}
                            onChange={setOtp}
                            disabled={verifyOtp.isPending}
                        >
                            <InputOTPGroup>
                                {Array.from({ length: SB_OTP_TOKEN_LENGTH }, (_, i) => (
                                    <InputOTPSlot key={i} index={i} />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>

                    <Button
                        type="button"
                        disabled={
                            otp.length !== SB_OTP_TOKEN_LENGTH || verifyOtp.isPending || pending
                        }
                        className="w-full cursor-pointer! disabled:opacity-80 disabled:cursor-not-allowed!"
                        onClick={onOtpConfirm}
                    >
                        {pending || verifyOtp.isPending ? (
                            <Loader2Icon className="animate-spin w-3 h-3" />
                        ) : null}
                        Confirm
                    </Button>

                    <Button
                        variant="link"
                        type="button"
                        className={cn('w-full cursor-pointer text-muted-foreground')}
                        onClick={onBackToEmail}
                    >
                        Use a different email
                    </Button>
                </div>
            )}
        </div>
    )
}
