import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_TO_ASSESS_STOCK_RISK_ARTICLE: EducationHubArticle = {
    slug: 'how-to-assess-stock-risk',
    title: 'How to Assess Stock Risk Before You Invest',
    description:
        'The goal is not to avoid risk — it is to get paid enough for taking it. Here is how professionals separate the risks that dent a quarter from the ones that destroy a thesis.',
    publishedAt: '2025-04-15',
    readingTimeMinutes: 5,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Picture a stock that could fall 40% in a recession but could also triple over five years. Is it risky? The honest answer is: it depends entirely on the price you pay and the odds you assign. Risk is not a thing to flee — it is a thing to price. The investors who do well are not the ones who avoid risk; they are the ones who refuse to take it unless the potential reward clearly justifies it.',
        },
        {
            heading: 'The Four Risks That Actually Move Stocks',
            body: 'Almost every threat to a stock fits one of four categories. Market risk hits everything at once — a recession or a rate shock drags good and bad companies down together, which is why diversification, not analysis, is the defence. Business risk is company-specific: a failed product, a lost key customer, a bad acquisition. Financial risk comes from the balance sheet — debt amplifies both gains and losses. And regulatory or macro risk lands on whole sectors at once: drug-pricing reform for pharma, antitrust for big tech, carbon rules for energy. Naming which bucket a risk lives in tells you whether you can diversify it away or must underwrite it directly.',
        },
        {
            heading: 'Financial Risk: Read the Debt Before the Story',
            body: 'Of the four, financial risk is the most quantifiable and the most underrated. Debt does not just add risk — it multiplies it. Compare two companies each earning $1 billion: one debt-free, one carrying $4 billion in debt. A 20% drop in earnings is a rough year for the first and a potential solvency crisis for the second. Three numbers tell the story: net debt to EBITDA (under 2x is comfortable, over 4x is fragile), interest coverage (can operating profit cover interest several times over?), and the maturity schedule (when must the debt be refinanced, and at what rate?). A highly leveraged company is a bet on everything going right.',
        },
        {
            heading: 'Are You Actually Being Compensated?',
            body: 'This is the question that turns risk assessment into investing. Suppose your honest estimate is a 30% chance the stock falls 50% and a 70% chance it doubles. The probability-weighted outcome is positive — you are being paid to take the risk. Flip it to a 70% chance of a 50% loss and a 30% chance of a double, and the same volatility is now a bad bet. The stock did not change; the odds and the price did. This is why two investors can look at the identical risk and one is right to buy while the other is right to pass — the difference is the price they are being asked to pay for the same uncertainty.',
        },
        {
            heading: "Volatility and Beta: Useful, but Don't Confuse Them With Risk",
            body: 'Beta measures how much a stock moves relative to the market: a beta of 1.5 means it tends to rise 15% when the market rises 10%, and fall just as hard. Volatility measures the size of those swings. Both are handy for sizing positions and understanding short-term pain — but neither tells you whether the underlying business can be permanently impaired. A stock can be highly volatile and low-risk (a sound company the market keeps repricing on noise) or calm and high-risk (a quietly deteriorating business not yet found out). Price movement is not the same as the danger of permanent loss.',
        },
    ],
}
