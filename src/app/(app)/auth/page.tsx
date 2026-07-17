import type { Metadata } from 'next'
import { AuthCard } from '@/modules/auth/auth-card'
import { AuthLayout } from '@/modules/auth/auth-layout'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Sign In'
const META_DESCRIPTION =
    'Sign in to your BrewStockAI account to access AI-powered stock analysis reports, track your credit balance, and manage your settings.'
const META_URL = `${SITE_URL}/auth`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

type Props = PageProps<'/auth'>

export default async function AuthPage({ searchParams }: Props) {
    const { returnTo } = await searchParams

    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />
            <AuthLayout>
                <AuthCard returnTo={typeof returnTo === 'string' ? returnTo : undefined} />
            </AuthLayout>
        </>
    )
}
