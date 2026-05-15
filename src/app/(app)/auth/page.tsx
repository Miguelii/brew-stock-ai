import type { Metadata } from 'next'
import { AuthCard } from '@/modules/auth/auth-card'
import { AuthLayout } from '@/modules/auth/auth-layout'

export const metadata: Metadata = {
    title: 'Sign In',
}

type Props = PageProps<'/auth'>

export default async function AuthPage({ searchParams }: Props) {
    const { returnTo } = await searchParams

    return (
        <AuthLayout>
            <AuthCard returnTo={typeof returnTo === 'string' ? returnTo : undefined} />
        </AuthLayout>
    )
}
