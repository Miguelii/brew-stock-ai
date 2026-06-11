import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_TO_READ_A_BALANCE_SHEET_ARTICLE: EducationHubArticle = {
    slug: 'how-to-read-a-balance-sheet',
    title: 'How to Read a Balance Sheet in Five Minutes',
    description:
        'The income statement tells you how a company performed; the balance sheet tells you whether it survives a bad year. Here is the five-minute reading order professionals actually use.',
    publishedAt: '2025-07-07',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Earnings get the headlines, but companies do not die from a weak quarter — they die from balance sheets that cannot absorb one. The balance sheet is a photograph of everything a company owns and owes at a single moment, and reading it well takes far less time than people fear. You do not need to audit every line. You need to check five things in a specific order, and each one answers a question that the income statement cannot.',
        },
        {
            heading: 'The Structure: One Equation, Two Sides',
            body: "Every balance sheet is the same equation: assets equal liabilities plus shareholders' equity. Assets are what the company owns — cash, inventory, receivables, factories, acquired brands. Liabilities are what it owes — supplier bills, debt, deferred obligations. Equity is the residual that belongs to shareholders. Both sides always balance by definition, which is why the interesting information is never the totals but the composition: what kind of assets, what kind of liabilities, and how quickly each side converts into actual cash.",
        },
        {
            heading: 'Check One: Cash Versus Short-Term Obligations',
            body: "Start with liquidity — can the company pay its bills this year? Compare current assets (cash, receivables, inventory) against current liabilities (everything due within twelve months). The current ratio divides one by the other, and a figure comfortably above 1 means near-term obligations are covered. Be stricter when the current assets are mostly inventory, which is the hardest asset to turn into cash in a hurry — a retailer with shelves full of last season's stock can pass the ratio test on paper and still hit a cash crunch. Cash and equivalents are the part of the number you can fully trust.",
        },
        {
            heading: 'Check Two: The Debt Load and Its Deadline',
            body: 'Next, total debt — not just the amount but the schedule. Net debt (total debt minus cash) relative to EBITDA is the standard gauge: under 2x is comfortable, over 4x demands an explanation. Then find the maturity schedule in the notes, because the same debt can be harmless or lethal depending on when it comes due. A company that borrowed cheaply in 2021 and faces a refinancing wall at sharply higher rates has a problem the headline ratio does not show. Companies rarely collapse because debt is large; they collapse because it comes due at the worst possible moment.',
        },
        {
            heading: 'Check Three: What the Assets Are Actually Made Of',
            body: 'Two asset types deserve suspicion. Goodwill is the premium paid in past acquisitions — it represents hope, not property, and when an acquisition disappoints, goodwill gets written down and equity takes the hit. A balance sheet where goodwill is a large share of total assets is a record of expensive shopping that still has to prove itself. Receivables are the second tell: if money owed by customers grows much faster than revenue, the company may be booking sales its customers have not truly paid for — one of the oldest early warnings of earnings trouble. Tangible, productive assets and real cash deserve more weight than either.',
        },
        {
            heading: 'Check Four and Five: Equity Trend and the Quiet Lines',
            body: 'Retained earnings — accumulated profits kept in the business — should generally grow over time in a healthy company; a shrinking equity base with rising debt is a deteriorating story even when earnings look fine. Then skim the quiet lines: pension obligations, lease liabilities, and anything in the notes labelled contingent. None of this requires expertise, only the willingness to look. Five minutes on these checks tells you whether the company is built on a foundation or a ledge — and that context changes how you read every other number it reports. The balance sheet will not tell you if the stock is cheap, but it will tell you whether the business gets to keep playing when conditions turn.',
        },
    ],
}
