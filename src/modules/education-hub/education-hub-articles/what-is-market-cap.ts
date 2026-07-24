import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_MARKET_CAP_ARTICLE: EducationHubArticle = {
    slug: 'what-is-market-cap',
    title: 'Market Cap vs. Enterprise Value: Why the Sticker Price Lies',
    description:
        'Two companies can have the same market cap and be worth completely different amounts. The number that actually tells you what a business costs is the one most beginners ignore.',
    publishedAt: '2025-05-05',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 9,
    theme: 'stock-analysis',
    keyTakeaways: [
        'Market cap prices the equity. Enterprise value prices the whole business, including the debt you inherit.',
        'Enterprise value equals market cap plus debt minus cash.',
        'A cash-rich company can be cheaper than its market cap suggests. A leveraged one is almost always more expensive.',
        'Share price on its own says nothing about size or value. A $10 stock can be a larger company than a $500 one.',
        'Use market cap for sizing and index membership. Use enterprise value for comparing what businesses cost.',
    ],
    sections: [
        {
            body: 'Market cap is the first number anyone learns about a stock, and the one that quietly causes the most confused valuations. It looks like the price of the company, but it is only the price of the equity. Imagine buying a house listed at $400,000 that comes with a $300,000 mortgage you must assume. The sticker says $400,000; your actual cost is $700,000. Companies work exactly the same way, and the number that captures the full cost has a different name.',
        },
        {
            heading: 'What market cap actually measures',
            body: "Market cap is the share price multiplied by shares outstanding. Five hundred million shares at $200 each gives a $100 billion market cap. It is the market's live valuation of the equity and it changes by the second. It is genuinely useful for one thing, and that thing is sizing.",
            table: {
                caption: 'What size brackets tell you',
                headers: ['Bracket', 'Rough range', 'What it usually implies'],
                rows: [
                    [
                        'Large cap',
                        'Above $10bn',
                        'Established, liquid, heavily covered by analysts. Less room for the market to be badly wrong in either direction.',
                    ],
                    [
                        'Mid cap',
                        '$2bn to $10bn',
                        'Past the survival question but still able to grow meaningfully. Moderate coverage.',
                    ],
                    [
                        'Small cap',
                        'Below $2bn',
                        'Thin analyst coverage and thin liquidity, which creates both the opportunity and the risk. Wider outcomes in both directions.',
                    ],
                ],
                footnote:
                    'The boundaries are conventions rather than rules, and they shift over time as markets grow.',
            },
            afterBody:
                'Sizing is roughly all that market cap reliably tells you. It does not tell you what the business costs, and it is not comparable across companies financed in different ways.',
        },
        {
            heading: 'The share price tells you nothing at all',
            body: 'A related confusion is worth clearing up first. The price of one share is meaningless in isolation, because a company chooses how many shares to slice itself into. A company can split its stock and halve the share price without anything changing.',
            table: {
                caption: 'Same company value, different share prices',
                headers: ['', 'Company X', 'Company Y'],
                rows: [
                    ['Share price', '$8', '$450'],
                    ['Shares outstanding', '5,000m', '40m'],
                    ['Market cap', '$40.0bn', '$18.0bn'],
                ],
                footnote:
                    'Illustrative. The cheaper-looking stock belongs to the company more than twice the size.',
            },
            afterBody:
                'A stock is not "cheap" because the share price is low, and not "expensive" because it is high. Any statement about value has to involve the whole company on one side and something the company produces, such as earnings or cash flow, on the other.',
        },
        {
            heading: 'Enterprise value: what you would actually pay to own it',
            body: 'Enterprise value fixes the blind spot. The formula is market cap plus total debt minus cash and equivalents. An acquirer who buys the equity also inherits the debt, and gets to keep the cash sitting on the balance sheet, so both belong in the price.',
            table: {
                caption: 'Same market cap, very different real cost',
                headers: ['', 'Company A', 'Company B'],
                rows: [
                    ['Market cap', '$10.0bn', '$10.0bn'],
                    ['Total debt', '$6.0bn', '$0.2bn'],
                    ['Cash', '$0.3bn', '$4.0bn'],
                    ['Enterprise value', '$15.7bn', '$6.2bn'],
                    ['Operating earnings (EBITDA)', '$1.5bn', '$1.5bn'],
                    ['EV / EBITDA', '10.5x', '4.1x'],
                ],
                footnote:
                    'Illustrative. Identical market caps, identical operating earnings, and one business costs more than twice the other.',
            },
            afterBody:
                'On market cap the two companies look identical. On enterprise value, Company B is dramatically cheaper, and it is also the safer one, because its earnings are not committed to servicing debt. That is a large conclusion to reach from a number most beginners never look at.',
        },
        {
            heading: 'Why this changes how you compare stocks',
            body: 'Once you see enterprise value, the popular valuation ratios sort themselves into two groups: those that see the balance sheet and those that do not.',
            table: {
                caption: 'Equity-level versus enterprise-level multiples',
                headers: ['Ratio', 'Numerator', 'Sees debt?', 'Best for'],
                rows: [
                    [
                        'P/E',
                        'Market cap',
                        'No',
                        'Quick comparison between similarly financed companies in the same sector.',
                    ],
                    [
                        'Price to free cash flow',
                        'Market cap',
                        'No',
                        'Checking whether reported profit turns into cash for shareholders.',
                    ],
                    [
                        'EV / EBITDA',
                        'Enterprise value',
                        'Yes',
                        'Comparing companies with different debt levels, or valuing an acquisition.',
                    ],
                    [
                        'EV / Sales',
                        'Enterprise value',
                        'Yes',
                        'Businesses that are unprofitable today but have meaningful revenue.',
                    ],
                    [
                        'EV / EBIT',
                        'Enterprise value',
                        'Yes',
                        'Capital-intensive businesses, where ignoring depreciation flatters the picture.',
                    ],
                ],
            },
            afterBody:
                'A company can look cheap on P/E and expensive on EV/EBITDA the moment its debt is counted, and the second number is usually the more honest one. If two companies in the same sector disagree sharply between the two ratios, the balance sheet is the reason and it is worth reading.',
        },
        {
            heading: 'Where enterprise value gets tricky',
            body: 'The formula is simple; applying it carefully is less so. A few adjustments separate a rough calculation from a defensible one.',
            list: {
                items: [
                    'Not all cash is available. Cash held overseas, cash required for daily operations, and cash committed to a pending acquisition cannot all be netted off in the same way.',
                    'Leases are debt. Long-term operating leases are contractual obligations, and modern accounting brings most of them onto the balance sheet. Ignoring them understates enterprise value in retail, airlines, and restaurants.',
                    'Pension deficits behave like debt. An underfunded pension is a claim on future cash flow whether or not it appears in the debt line.',
                    'Minority interests belong in the total. If a company consolidates a subsidiary it does not fully own, the portion belonging to others is part of the enterprise but not part of the market cap.',
                    'Banks and insurers are the exception. For financial companies, debt is raw material rather than financing, so enterprise value is not meaningful and price to book is used instead.',
                ],
            },
        },
        {
            heading: 'When market cap still earns its keep',
            body: 'Market cap is not useless, it just answers a narrower question than people assume. It determines index membership, and that has real consequences: when a company grows large enough to enter a major index, index funds are obliged to buy its shares, creating demand that has nothing to do with the underlying business.',
            callout: {
                title: 'A simple rule',
                body: 'Use market cap to answer "how big is this company and how liquid is the stock". Use enterprise value to answer "what does this business cost, and is it cheaper than that one". Confusing the two questions is how a heavily indebted company ends up on a screen labelled cheap.',
            },
        },
    ],
}
