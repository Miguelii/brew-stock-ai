import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_EBITDA_ARTICLE: EducationHubArticle = {
    slug: 'what-is-ebitda',
    title: 'EBITDA: What It Hides and Why Analysts Use It Anyway',
    description:
        'Famous investors mock it, every analyst quotes it, and entire buyout industries are priced on it. Here is what EBITDA usefully measures, and the real costs it quietly deletes.',
    publishedAt: '2025-08-04',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 9,
    theme: 'stock-analysis',
    keyTakeaways: [
        'EBITDA strips out financing, tax, and accounting choices to compare operating engines on equal footing.',
        'It is a comparison tool, not a profit measure. No shareholder was ever paid before interest and taxes.',
        'Depreciation is non-cash this year and brutally real over time: equipment must eventually be replaced.',
        'EBITDA flatters capital-intensive businesses and is roughly honest for asset-light ones.',
        'The longer the list of adjustments in "adjusted EBITDA", the more carefully you should read what was excluded.',
    ],
    sections: [
        {
            body: 'Few numbers in finance provoke stronger opinions. Some of the most respected investors alive dismiss it as a way of making a business look better than it is; meanwhile nearly every analyst report, credit agreement, and acquisition is priced off it. Both camps are right about something. EBITDA is a genuinely useful comparison tool and a genuinely dangerous profit measure, and the trick is knowing which job it is doing in front of you.',
        },
        {
            heading: 'What the acronym strips away',
            body: 'EBITDA is earnings before interest, taxes, depreciation, and amortisation. You start with operating profit and add the four items back. Each removal has a rationale, and each one also removes something real.',
            table: {
                caption: 'The four exclusions',
                headers: ['Excluded', 'Why it is removed', 'What that hides'],
                rows: [
                    [
                        'Interest',
                        'It reflects how the company chose to finance itself, not how well it operates.',
                        'Debt is a real obligation with a real cost, and a leveraged company is a riskier one.',
                    ],
                    [
                        'Taxes',
                        'Rates vary by jurisdiction and by year, obscuring operating comparison.',
                        'Tax is cash that leaves the company and never reaches shareholders.',
                    ],
                    [
                        'Depreciation',
                        'A non-cash accounting allocation of money spent in earlier years.',
                        'Assets wear out. Replacing them consumes cash, usually on a predictable schedule.',
                    ],
                    [
                        'Amortisation',
                        'A non-cash write-down of acquired intangibles, often unrelated to operations.',
                        'For a serial acquirer, the acquisitions generating it are the business model.',
                    ],
                ],
            },
            afterBody:
                'Strip all four and you get a rough proxy for the cash-generating power of the core operations, before financing decisions, tax strategies, and accounting allocations enter the picture. Note the word rough: EBITDA is not cash flow, because it also ignores working capital movements entirely.',
        },
        {
            heading: 'Why analysts reach for it',
            body: 'The stripping is the point. Two operationally identical factories can report very different net incomes if one was bought with debt in a high-tax country and the other with cash in a low-tax one. EBITDA makes them comparable.',
            list: {
                items: [
                    'It allows comparison across companies with different capital structures, which is why EV/EBITDA became the standard yardstick for relative valuation.',
                    'It allows comparison across borders, since tax regimes vary far more than operating performance does.',
                    'Lenders write debt covenants as multiples of EBITDA, because it approximates the cash available to service obligations before those obligations are counted.',
                    'It is relatively stable, which makes trends easier to read than net income, where a single one-off item can dominate a year.',
                ],
            },
            afterBody:
                'For the narrow job of comparing operating engines across companies and borders, it is honestly hard to beat. The problems start when the comparison tool gets promoted to a measure of profit.',
        },
        {
            heading: 'The costs it pretends are optional',
            body: 'Depreciation is non-cash this year, but it represents something brutally real: machines wear out, vehicles age, data centres become obsolete, and replacing them consumes actual cash. For asset-heavy businesses, depreciation approximates a recurring bill that absolutely must be paid for the company to keep operating at all.',
            table: {
                caption: 'How far EBITDA sits from reality, by business type',
                headers: ['Business type', 'Capital intensity', 'How honest EBITDA is'],
                rows: [
                    [
                        'Software and services',
                        'Low',
                        'Reasonably honest. Depreciation is small, so EBITDA and cash flow converge.',
                    ],
                    [
                        'Consumer brands',
                        'Moderate',
                        'Usable, but check capital expenditure against depreciation.',
                    ],
                    [
                        'Manufacturing',
                        'High',
                        'Misleading on its own. Replacement capex is a permanent, unavoidable cost.',
                    ],
                    [
                        'Airlines, telecoms, utilities',
                        'Very high',
                        'Actively deceptive if used as profit. These businesses can post strong EBITDA and burn cash every year.',
                    ],
                ],
            },
            afterBody:
                'The quick test is to compare annual capital expenditure against annual depreciation over five years. If capex consistently matches or exceeds depreciation, the depreciation charge EBITDA removed was a fair estimate of a real recurring cost, and adding it back tells you very little.',
        },
        {
            heading: 'Adjusted EBITDA: where creativity lives',
            body: 'It gets worse before it gets better. Many companies report "adjusted EBITDA", adding back further items they deem one-off: restructuring charges, share-based compensation, litigation costs, acquisition expenses. Sometimes the adjustments are fair. Often they are a parade of supposedly exceptional costs that somehow recur every single year.',
            callout: {
                title: 'The pattern to watch',
                body: 'Line up reported net income, EBITDA, and adjusted EBITDA for the last five years. If the gap between them widens every year, the adjustments are not removing noise, they are removing the business. The most infamous examples in recent market history involved companies excluding marketing and administrative costs on the way to claiming profitability, which is another way of saying profitable before the costs of being a company.',
            },
            afterBody:
                "Share-based compensation deserves particular attention. It is genuinely non-cash, which is the usual justification for excluding it, but it dilutes your ownership directly. It is a real cost paid in a currency that happens to be your equity rather than the company's money.",
        },
        {
            heading: 'Using it without being used by it',
            body: 'Treat EBITDA as a comparison tool, never a conclusion. A short routine keeps it useful.',
            list: {
                ordered: true,
                items: [
                    'Use EV/EBITDA to rank similar businesses within a sector. That is the job it is good at.',
                    'Immediately cross-check against free cash flow, which counts the bills EBITDA ignores.',
                    'Compare capital expenditure to depreciation over five years. This tells you how much of the added-back depreciation is a real recurring cost.',
                    'Read what "adjusted" excludes, and check whether the same items appeared last year and the year before.',
                    'Note the capital intensity of the industry before trusting the number at all.',
                ],
            },
            afterBody:
                'If EBITDA is large but free cash flow is persistently thin or negative, the gap is usually capital expenditure, and the business is more expensive to run than the headline suggests. For asset-light companies where depreciation is genuinely small, EBITDA and cash flow converge and the metric is close to honest. Knowing which kind of business you are looking at is most of the skill.',
        },
    ],
}
