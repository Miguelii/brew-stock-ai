import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default function SignupPage() {
    return notFound()
    /* return (
        <AuthLayout>
            <SignupCard />
        </AuthLayout>
    ) */
}
