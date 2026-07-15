import type { ChangelogEntry } from '@/types/ChangelogEntry'

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
    {
        slug: 'deeper-grounded-analysis',
        version: 'v1.1',
        title: 'A deeper, more grounded analysis engine',
        description:
            'Our AI now reads earnings trends, analyst consensus, technical signals, and the latest news — and shows it all directly in your reports.',
        publishedAt: '2026-06-04',
        tags: ['Improved'],
        highlights: [
            'Earnings beats and misses, plus forward EPS and revenue estimates',
            'Analyst rating consensus and recent insider activity',
            'Technical signals: moving averages, RSI, momentum and volatility',
            'The latest company news woven into every analysis',
            'All of it now visible in the Key Financial Metrics section',
        ],
        sections: [
            {
                body: 'Every report you generate just got a serious upgrade. Instead of judging a company from a single snapshot, our AI now reasons over a much richer picture — the same kind of evidence a real analyst weighs before forming a view. The result is analysis that is more grounded, more specific, and easier to trust.',
            },
            {
                heading: 'Richer context, sharper judgment',
                body: 'We expanded the data the model sees before it writes a single word. It now combines three layers of evidence and weighs them the way a disciplined analyst would — fundamentals first, with technicals and news as confirming signals rather than the core of the case.',
                bullets: [
                    'Fundamentals: earnings beats and misses across recent quarters, forward EPS and revenue estimates, and a multi-year revenue and net-income trend.',
                    'Market signals: the full analyst rating distribution and recent insider buying or selling.',
                    'Technicals: moving averages and trend regime, RSI, 52-week position, trailing returns and volatility.',
                    'News: the most recent company headlines, used to confirm or challenge the thesis.',
                ],
            },
        ],
    },
]

export const CHANGELOG_ENTRY_MAP = new Map(CHANGELOG_ENTRIES.map((e) => [e.slug, e]))

export const CHANGELOG_ENTRIES_BY_DATE = CHANGELOG_ENTRIES.toSorted((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
)

export const LATEST_CHANGELOG_ENTRY = CHANGELOG_ENTRIES_BY_DATE[0]
