import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_PE_RATIO_ARTICLE: EducationHubArticle = {
    slug: 'what-is-pe-ratio',
    title: 'What Is the P/E Ratio and Why Does It Matter?',
    description:
        "The Price-to-Earnings ratio is the most cited number in investing — and one of the most misunderstood. Here's what it measures, how to read it, and exactly when it lies.",
    publishedAt: '2025-04-05',
    readingTimeMinutes: 5,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Open any financial news site and you will see stocks described as trading at "20x earnings" or "50x forward earnings." The P/E ratio is the single most quoted number in markets — and also the one most often used without thinking. Understanding what it actually says, and what it conveniently leaves out, separates investors who use it well from those it quietly misleads.',
        },
        {
            heading: 'The Basic Calculation',
            body: "The P/E ratio is a stock's price divided by its earnings per share. A stock at $100 earning $5 per share trades at a P/E of 20 — you are paying $20 for every $1 of annual profit. You will see two versions: trailing P/E (the last 12 months of actual earnings) and forward P/E (analyst estimates for the next 12). Forward P/E usually matters more for growing companies, because it reflects where the business is going rather than where it has been — but it is only as reliable as the estimates behind it, and estimates are frequently wrong.",
        },
        {
            heading: 'Why the Same P/E Means Opposite Things',
            body: 'Here is the part most explanations skip. In late 2023, Coca-Cola traded around 23x earnings and Nvidia traded above 60x. The market was not calling Nvidia six times "better" — it was pricing in explosive growth. Coca-Cola sells roughly the same amount of soda each year, so investors pay a modest multiple for stability. Nvidia\'s earnings were doubling, so a high multiple today can look cheap in hindsight if the growth arrives. A P/E is not a verdict on quality; it is a bet on the future packed into a single number. A low P/E on a declining business is a value trap, not a bargain.',
        },
        {
            heading: 'Comparing P/E Ratios Correctly',
            body: "A P/E in isolation is almost meaningless. It only becomes useful through three comparisons: against the company's own history (is it more or less expensive than it usually is?), against its sector (premium or discount to peers?), and against the broader market. A software company at 30x looks expensive until you notice its sector trades at 40x — at which point it is relatively cheap. Always anchor the number to something.",
        },
        {
            heading: 'When the P/E Ratio Lies to You',
            body: 'The P/E breaks in predictable ways. It is useless for companies with negative earnings — start-ups, turnarounds, cyclical troughs — because you cannot divide by a loss. It is distorted by one-off accounting items that inflate or deflate reported earnings for a single period. And it ignores debt entirely: two companies at the same P/E can carry wildly different risk if one is debt-free and the other is leveraged to the hilt. For a fuller picture, pair it with EV/EBITDA (which accounts for debt) and the PEG ratio (which adjusts for growth). The P/E is a starting point, never the finish line.',
        },
    ],
}
