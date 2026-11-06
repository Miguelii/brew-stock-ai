import type { Metadata } from 'next'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema } from '@/components/structured-data'
import { McpHero } from '@/modules/mcp/mcp-hero'
import { SetupSteps } from '@/modules/mcp/setup-steps'
import { UsageSection } from '@/modules/mcp/usage-section'
import { McpCta } from '@/modules/mcp/mcp-cta'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'BrewStock MCP for Claude Code'
const META_DESCRIPTION =
    'Connect the BrewStock MCP server to Claude Code in four steps and get stock analyses backed by live market data, right inside your AI assistant.'
const META_URL = `${SITE_URL}/mcp`

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

export default function McpPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />

            <main id="main" className="w-full overflow-x-clip">
                <McpHero />
                <SetupSteps />
                <UsageSection />
                <McpCta />
            </main>
        </>
    )
}
