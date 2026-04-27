import type { Metadata } from 'next'
import { SignupCard } from '@/features/auth/signup-card'
import { AuthLayout } from '@/features/auth/auth-layout'

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default function SignupPage() {
    return (
        <AuthLayout>
            <SignupCard />
        </AuthLayout>
    )
}
