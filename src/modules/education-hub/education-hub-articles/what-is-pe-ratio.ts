import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_PE_RATIO_ARTICLE: EducationHubArticle = {
    slug: 'what-is-pe-ratio',
    title: 'What Is the P/E Ratio and Why Does It Matter?',
    description:
        "The Price-to-Earnings ratio is the most cited number in investing, and one of the most misunderstood. Here's what it measures, how to read it, and exactly when it lies.",
    publishedAt: '2025-04-05',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 9,
    theme: 'stock-analysis',
    keyTakeaways: [
        'The P/E ratio tells you how many years of current profit you are paying for, at the current price.',
        "A P/E on its own is meaningless. It only says something when anchored to the company's own history, its sector, or the market.",
        'A high P/E is a forecast of growth, not a verdict on quality. A low P/E on a shrinking business is a value trap.',
        'The P/E ignores debt entirely, which is why two companies on the same multiple can carry completely different risk.',
        'It breaks whenever earnings are negative, distorted by one-off items, or heavily cyclical.',
    ],
    sections: [
        {
            body: 'Open any financial news site and you will see stocks described as trading at "20x earnings" or "50x forward earnings." The P/E ratio is the single most quoted number in markets, and also the one most often used without thinking. Understanding what it actually says, and what it conveniently leaves out, separates investors who use it well from those it quietly misleads.',
        },
        {
            heading: 'The basic calculation',
            body: "The P/E ratio is a stock's price divided by its earnings per share. If a stock trades at $100 and the company earned $5 per share over the last year, the P/E is 20: you are paying $20 for every $1 of annual profit. Flipped upside down, that same ratio is an earnings yield of 5%, which is a more intuitive way to compare a stock against a bond or a savings account.",
            table: {
                caption: 'The same company at three different prices',
                headers: ['Share price', 'Earnings per share', 'P/E ratio', 'Earnings yield'],
                rows: [
                    ['$50', '$5.00', '10x', '10.0%'],
                    ['$100', '$5.00', '20x', '5.0%'],
                    ['$200', '$5.00', '40x', '2.5%'],
                ],
                footnote:
                    'Illustrative. Nothing about the business changed across these three rows: only the price did. This is why a rising P/E is not evidence of a better company.',
            },
            afterBody:
                'That last point is worth sitting with. The P/E moves whenever the price moves, which happens every second the market is open, while earnings update four times a year. Most of the short-term movement in a P/E ratio is telling you about sentiment, not about the business.',
        },
        {
            heading: 'Trailing versus forward P/E',
            body: 'You will see two versions quoted, and they answer different questions. Trailing P/E uses the last twelve months of reported earnings: it is factual, auditable, and backward-looking. Forward P/E uses analyst estimates for the next twelve months: it is more relevant for a company whose profits are changing quickly, and it is only as reliable as the estimates behind it.',
            table: {
                caption: 'Which one to use',
                headers: ['Situation', 'Prefer', 'Why'],
                rows: [
                    [
                        'Stable, mature business',
                        'Trailing',
                        'Next year will look much like last year, and the trailing figure is a fact rather than a forecast.',
                    ],
                    [
                        'Fast-growing company',
                        'Forward',
                        'Trailing earnings understate the business. A 60x trailing multiple can be 30x forward if profits are doubling.',
                    ],
                    [
                        'Recovering from a bad year',
                        'Forward, cautiously',
                        'Trailing earnings are depressed by a one-off. But recovery estimates are the ones analysts most often get wrong.',
                    ],
                    [
                        'Cyclical business',
                        'Neither alone',
                        'Both are distorted by where you are in the cycle. Use average earnings across a full cycle instead.',
                    ],
                ],
            },
            afterBody:
                'One habit worth building: when someone quotes a forward P/E, ask whose estimate it uses and how much the company would have to grow to hit it. A cheap-looking forward multiple often rests on an assumption of acceleration that nobody has justified.',
        },
        {
            heading: 'Why the same P/E means opposite things',
            body: 'Here is the part most explanations skip. Consider a beverage company that sells roughly the same volume every year, and a semiconductor company whose profits are doubling. Both could trade at very different multiples, and both could be correctly priced. The market is not calling one six times better than the other; it is pricing in different growth. A P/E is not a verdict on quality, it is a bet about the future packed into a single number.',
            callout: {
                title: 'The mechanism',
                body: 'A stock is worth the cash it will generate for the rest of its life, discounted back to today. Almost all of that value sits in future years, not the current one. The P/E ratio uses only the current year as its denominator, so everything the market believes about all the other years gets crammed into the multiple. A high P/E is not expensive by itself: it is a statement that most of the value is still ahead.',
            },
        },
        {
            heading: 'Comparing P/E ratios correctly',
            body: 'A P/E in isolation is almost meaningless. It only becomes useful through comparison, and there are three that matter:',
            list: {
                ordered: true,
                items: [
                    "Against the company's own history. Is this business more or less expensive than it usually is? A company that has averaged 18x for a decade and now trades at 30x needs an explanation.",
                    'Against its sector. Software companies structurally trade higher than banks, because their earnings grow faster and require less capital. A 30x software company is not expensive in a sector trading at 40x.',
                    'Against the broader market. This tells you what premium or discount the market applies to this business relative to the average listed company, which is a rough proxy for perceived quality and growth.',
                ],
            },
            afterBody:
                'If a comparison spans different sectors, different capital structures, or different points in an economic cycle, it is not really a comparison. Most bad P/E arguments come from comparing two things that were never comparable.',
        },
        {
            heading: 'A worked example: cheap is not the same as good',
            body: 'Take two fictional companies, each earning $5 per share this year, to show why the multiple alone decides nothing.',
            table: {
                caption: 'Two companies, same earnings today',
                headers: ['', 'Company A', 'Company B'],
                rows: [
                    ['Share price', '$50', '$120'],
                    ['Earnings per share, this year', '$5.00', '$5.00'],
                    ['P/E ratio', '10x', '24x'],
                    ['Earnings trend', 'Falling around 10% a year', 'Growing around 15% a year'],
                    ['Earnings per share in five years', 'About $2.95', 'About $10.06'],
                    ["P/E on those future earnings, at today's price", 'About 17x', 'About 12x'],
                ],
                footnote:
                    'Illustrative, and it assumes the trends hold, which is exactly the assumption you have to defend. But the direction of the result is the point.',
            },
            afterBody:
                'Company A looked half the price on day one and is the more expensive stock five years later. The cheap multiple was not a discount, it was the market correctly pricing a shrinking business. This is what a value trap is, and it is the single most common way the P/E ratio costs people money.',
        },
        {
            heading: 'When the P/E ratio lies to you',
            body: 'The ratio breaks in predictable ways. Knowing them is more useful than knowing the formula:',
            list: {
                items: [
                    'Negative earnings. You cannot divide by a loss. Start-ups, turnarounds, and cyclical troughs simply have no meaningful P/E, and a screen that filters on the ratio will silently drop them all.',
                    'One-off items. A single asset sale, impairment, legal settlement, or tax change can inflate or deflate reported earnings for one period, and the P/E moves with it despite nothing changing in the underlying business.',
                    'Debt is invisible. Two companies on the same multiple can carry wildly different risk if one is debt-free and the other is heavily leveraged. The P/E uses market capitalisation, which ignores the balance sheet entirely.',
                    'Cyclical inversion. In a mining or shipping company, the P/E looks lowest exactly at the peak of the cycle, when earnings are unsustainably high, and highest at the bottom, when they are depressed. It gives you precisely the wrong signal.',
                    'Accounting earnings are not cash. Depreciation schedules, capitalised costs, and share-based compensation all separate reported profit from money actually generated.',
                ],
            },
        },
        {
            heading: 'What to pair it with',
            body: 'No single ratio survives contact with a real company. The P/E is a starting point, and each of its blind spots has a companion metric that covers it.',
            table: {
                caption: "Covering the P/E ratio's blind spots",
                headers: ['Metric', 'What it adds', 'Use it when'],
                rows: [
                    [
                        'PEG ratio',
                        'Divides the P/E by the growth rate, so fast growers and slow growers become comparable.',
                        'Comparing companies growing at very different speeds.',
                    ],
                    [
                        'EV/EBITDA',
                        'Includes debt and strips out capital-structure differences.',
                        'The companies are leveraged differently, or one has just made an acquisition.',
                    ],
                    [
                        'Price to free cash flow',
                        'Uses cash actually generated instead of accounting profit.',
                        'You suspect reported earnings and cash have drifted apart.',
                    ],
                    [
                        'Price to sales',
                        'Works when earnings are negative or temporarily meaningless.',
                        'The company is unprofitable by choice, or recovering from a loss year.',
                    ],
                    [
                        'Price to book',
                        'Anchors on balance-sheet value rather than income.',
                        'Analysing banks, insurers, and asset-heavy businesses.',
                    ],
                ],
            },
        },
        {
            heading: 'How to actually use it',
            body: 'A practical routine takes about two minutes and avoids most of the traps above.',
            list: {
                ordered: true,
                items: [
                    'Check whether earnings are positive and clean. If there was a large one-off item this year, the ratio is not usable until you strip it out.',
                    "Look at the ratio against the company's own five- or ten-year range before looking at anything else. This is the single most informative comparison and the one most often skipped.",
                    'Compare against three or four genuine peers, not against the market as a whole.',
                    'Ask what growth rate the multiple implies, and whether anything in the business supports it.',
                    'Check the debt. Then look at EV/EBITDA to see whether the picture changes once the balance sheet is included.',
                    'Only then form a view on whether the stock is expensive.',
                ],
            },
            afterBody:
                'The P/E ratio is a good question and a bad answer. Used to decide, it will eventually hand you a shrinking business at a tempting price. Used to ask what the market currently believes about a company, so that you can go and check whether that belief is reasonable, it is one of the most efficient tools in investing.',
        },
    ],
}
