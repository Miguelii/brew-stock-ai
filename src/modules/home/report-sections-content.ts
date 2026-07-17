import { BarChart3, FileText, Newspaper, Rss, Scale, Sparkles, TrendingUp, Zap } from 'lucide-react'

export const REPORT_SECTIONS = [
    {
        icon: FileText,
        title: 'Summary',
        description:
            'What the AI found: the overall verdict, top strengths, and the one risk you should know about.',
        featured: false,
    },
    {
        icon: TrendingUp,
        title: 'Market & Analyst Outlook',
        description:
            "Where the stock has traded over the past year, what Wall Street analysts think it's worth, and how their buy, hold, and sell recommendations break down.",
        featured: false,
    },
    {
        icon: BarChart3,
        title: 'Key Financial Metrics',
        description:
            'The numbers that matter: revenue and profitability, valuation, financial health, future estimates, and insider activity, all in plain English.',
        featured: false,
    },
    {
        icon: Sparkles,
        title: 'Full AI Report',
        description:
            'A complete, in-depth analysis of the company: growth, profitability, cash flow, and financial health, explained in clear terms.',
        featured: false,
    },
    {
        icon: Zap,
        title: "What's Happening Now",
        description:
            'The most notable recent event our AI found and why it matters. It could be a big announcement, a leadership change, or market-moving news.',
        featured: false,
    },
    {
        icon: Rss,
        title: 'Recent News',
        description:
            "The most recent headlines mentioning the company, pulled in real time so the analysis reflects what's happening today.",
        featured: false,
    },
    {
        icon: Newspaper,
        title: 'What Experts Are Saying',
        description:
            'A curated digest of recent reports from professional investors and analysts, filtered for relevance to this specific company.',
        featured: false,
    },
    {
        icon: Scale,
        title: 'How It Compares',
        description:
            'A side-by-side comparison with other companies in the same sector, showing where it leads, lags, or stands out.',
        featured: false,
    },
] as const
