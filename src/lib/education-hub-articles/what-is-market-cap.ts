import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_MARKET_CAP_ARTICLE: EducationHubArticle = {
    slug: 'what-is-market-cap',
    title: 'Market Cap vs. Enterprise Value: Why the Sticker Price Lies',
    description:
        'Two companies can have the same market cap and be worth completely different amounts. The number that actually tells you what a business costs is the one most beginners ignore.',
    publishedAt: '2025-05-05',
    readingTimeMinutes: 5,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Market cap is the first number anyone learns about a stock, and the one that quietly causes the most confused valuations. It looks like the price of the company — but it is only the price of the equity. Imagine buying a house listed at $400,000 that comes with a $300,000 mortgage you must assume. The sticker says $400,000; your actual cost is $700,000. Companies work exactly the same way, and the number that captures the full cost has a different name.',
        },
        {
            heading: 'What Market Cap Actually Measures',
            body: "Market cap is the share price multiplied by shares outstanding: 500 million shares at $200 each gives a $100 billion market cap. It is the market's live valuation of the equity, and it changes by the second. It is genuinely useful for one thing — sizing. Large caps (above ~$10 billion) are established, liquid, heavily covered. Mid caps ($2–10 billion) trade growth for stability. Small caps (below $2 billion) can multiply or implode, with thin analyst coverage creating both the risk and the opportunity. But sizing is all market cap reliably tells you. It does not tell you what the business costs.",
        },
        {
            heading: "Enterprise Value: What You'd Actually Pay to Own It",
            body: 'Enterprise value fixes the blind spot. The formula is market cap plus debt minus cash. If a company has a $10 billion market cap, $5 billion of debt, and $1 billion of cash, its enterprise value is $14 billion — because an acquirer who buys the equity also inherits the debt and gets the cash. EV is the true takeover price. This is why a debt-laden company with a "small" market cap can be far more expensive than it looks, and a cash-rich one with a large market cap can be cheaper than its sticker suggests. The cash and debt sitting behind the equity completely change the real price.',
        },
        {
            heading: 'Why This Changes How You Compare Stocks',
            body: 'Once you see EV, the popular valuation ratios make more sense. P/E uses only the equity, so it ignores the balance sheet entirely — two companies at an identical P/E of 15 can be priced completely differently once debt enters the picture. That is exactly why professionals lean on EV/EBITDA: by putting enterprise value over operating earnings, it compares businesses on equal footing regardless of how each one is financed. A company that looks cheap on P/E can look expensive on EV/EBITDA the moment its debt is counted — and that second number is usually the more honest one.',
        },
        {
            heading: 'When Market Cap Still Earns Its Keep',
            body: "Market cap is not useless — it just answers a narrower question than people assume. It determines index membership, and that has real consequences: when a company grows large enough to enter the S&P 500, index funds are forced to buy its shares, creating demand that has nothing to do with the underlying business. It is also a quick, honest read on liquidity and where a stock sits in the risk spectrum. Use market cap to understand a company's size and place in the market. Use enterprise value to understand what it actually costs.",
        },
    ],
}
