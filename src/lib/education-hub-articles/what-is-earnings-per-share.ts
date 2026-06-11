import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_EARNINGS_PER_SHARE_ARTICLE: EducationHubArticle = {
    slug: 'what-is-earnings-per-share',
    title: 'Earnings Per Share (EPS): What Moves Stocks on Report Day',
    description:
        'Stocks can swing 15% in minutes on earnings day — and the trigger is rarely the EPS number itself. Here is what the figure measures, and what the market is really reacting to.',
    publishedAt: '2025-04-20',
    readingTimeMinutes: 5,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'On an earnings day, a stock can move 15% in the first minute of trading. Newcomers assume the company must have made or lost a fortune overnight. It did not. What moved is the gap between the earnings the company reported and the earnings the market had already priced in. EPS is the headline number — but the reaction is all about expectations, and understanding that gap is the difference between watching the chart in confusion and knowing why it moved.',
        },
        {
            heading: 'The Basic Calculation',
            body: 'Earnings per share is net income (total profit after taxes and expenses) divided by the number of shares outstanding. A company earning $1 billion with 500 million shares has an EPS of $2.00 — each share represents two dollars of profit. As with most metrics, it comes in trailing form (the last 12 months) and forward form (analyst estimates for the next 12). The number itself is simple; the interesting part is everything around it.',
        },
        {
            heading: 'Beats, Misses, and Why the Stock Already Knew',
            body: 'The market does not react to the EPS number — it reacts to EPS versus expectations. When Meta reported fourth-quarter 2023 earnings in February 2024, results crushed estimates and the stock jumped roughly 20% the next day, adding nearly $200 billion in market value in a single session. Had it merely met expectations, the move would have been muted, because "good" was already in the price. The lesson: a company can grow earnings 30% and still fall if the market expected 40%. You are not trading the result; you are trading the surprise.',
        },
        {
            heading: 'GAAP vs. Adjusted: Mind the Gap',
            body: 'Most companies report two EPS figures: GAAP (standard accounting rules) and adjusted (excluding items management deems non-recurring). Adjusted EPS strips out things like restructuring charges and stock-based compensation, which can give a cleaner view of the underlying business — or quietly hide real costs. The tell is consistency: a "one-off" charge that reappears every single year is not one-off, it is a recurring cost being relabelled. Always check what is being excluded and whether it genuinely belongs out of the picture.',
        },
        {
            heading: 'Where EPS Growth Actually Comes From',
            body: 'Consistent EPS growth is what investors ultimately pay for, but not all growth is equal. It comes from three sources, and they are not interchangeable. Revenue growth — selling more — is the healthiest. Margin expansion — keeping more of each dollar — is good but has limits. Share buybacks shrink the share count, which lifts EPS even if total profit is flat. A company "growing EPS 10%" purely by buying back stock while sales stagnate is a very different investment from one growing 10% because it is genuinely selling more. Always ask which engine is driving the number.',
        },
    ],
}
