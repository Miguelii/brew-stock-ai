/**
 * Product content shared by the marketing homepage and the /analysis page: the five
 * analysis types the engine can run, and the three steps of the flow.
 *
 * Deliberately not in src/lib/constants.ts, which the middleware imports through
 * PROTECTED_PATHS and must stay free of icon components.
 */
import { BarChart3, Castle, Landmark, TrendingUp, TriangleAlert } from 'lucide-react'
import { IconEngine, IconReport, IconTicker } from '@/components/scene/step-icons'

export const PRODUCT_STATS = [
    { label: '8 Report Sections' },
    { label: '5 Analysis Types' },
    { label: '< ~2min Delivery' },
] as const

export const STEPS = [
    {
        icon: IconTicker,
        title: 'Pick a stock',
        description:
            'Type any ticker, from Apple to the small company you just read about. Then choose what you want to know: full analysis, financials, moat, risk, or growth.',
        tint: 'var(--blue)',
    },
    {
        icon: IconEngine,
        title: 'Our engine does the work',
        description:
            'The engine gathers earnings history, future estimates, analyst ratings, insider activity, price signals, and the latest news, then weighs all that evidence.',
        tint: 'var(--tangerine)',
    },
    {
        icon: IconReport,
        title: 'Read a structured report',
        description:
            'In under two minutes you get a report you can act on. Every claim is grounded in data, and the numbers sit right next to the analysis.',
        tint: 'var(--green)',
    },
] as const

export const ANALYSIS_TYPES = [
    {
        icon: Landmark,
        tone: 'navy',
        tag: 'Most complete',
        title: 'Wall Street analysis',
        description:
            'The complete report: valuation, financials, and competitive position, built with the same framework professional analysts use.',
    },
    {
        icon: BarChart3,
        tone: 'blue',
        tag: 'Financials',
        title: 'Deep financial breakdown',
        description:
            'Revenue trends, profit margins, cash flow health, and balance sheet strength, so you understand the financial foundation of any stock.',
    },
    {
        icon: Castle,
        tone: 'green',
        tag: 'Moat',
        title: 'Competitive advantage',
        description:
            'Find out if the company has a lasting edge over competitors: brand power, network effects, switching costs, and cost advantages.',
    },
    {
        icon: TriangleAlert,
        tone: 'amber',
        tag: 'Risk',
        title: 'Risk analysis',
        description:
            'Uncover hidden risks including debt exposure, regulatory threats, management concerns, and macroeconomic vulnerabilities.',
    },
    {
        icon: TrendingUp,
        tone: 'tangerine',
        tag: 'Growth',
        title: 'Growth potential',
        description:
            'Assess future growth drivers such as market expansion, product pipelines, international reach, and emerging sector trends.',
    },
] as const
