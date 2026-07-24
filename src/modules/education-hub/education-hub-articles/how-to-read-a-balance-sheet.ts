import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_TO_READ_A_BALANCE_SHEET_ARTICLE: EducationHubArticle = {
    slug: 'how-to-read-a-balance-sheet',
    title: 'How to Read a Balance Sheet in Five Minutes',
    description:
        'The income statement tells you how a company performed; the balance sheet tells you whether it survives a bad year. Here is the five-minute reading order professionals actually use.',
    publishedAt: '2025-07-07',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 10,
    theme: 'stock-analysis',
    keyTakeaways: [
        'Companies rarely fail from a weak quarter. They fail from a balance sheet that cannot absorb one.',
        'Assets equal liabilities plus equity by definition, so the totals are never the interesting part. The composition is.',
        'Debt maturity matters more than debt size: the same borrowing is harmless or fatal depending on when it comes due.',
        'Goodwill is the premium paid for past acquisitions. It represents hope, not property.',
        'Receivables growing much faster than revenue is one of the earliest warnings of earnings trouble.',
    ],
    sections: [
        {
            body: 'Earnings get the headlines, but companies do not die from a weak quarter; they die from balance sheets that cannot absorb one. The balance sheet is a photograph of everything a company owns and owes at a single moment, and reading it well takes far less time than people fear. You do not need to audit every line. You need to check five things in a specific order, and each one answers a question the income statement cannot.',
        },
        {
            heading: 'The structure: one equation, two sides',
            body: "Every balance sheet is the same equation: assets equal liabilities plus shareholders' equity. Assets are what the company owns. Liabilities are what it owes. Equity is the residual that belongs to shareholders. Both sides always balance by definition, which is why the interesting information is never the totals but the composition: what kind of assets, what kind of liabilities, and how quickly each converts into actual cash.",
            table: {
                caption: 'What sits where',
                headers: ['Assets', 'Liabilities', 'Equity'],
                rows: [
                    [
                        'Cash and equivalents',
                        'Accounts payable (supplier bills)',
                        'Share capital raised from investors',
                    ],
                    [
                        'Accounts receivable (money owed by customers)',
                        'Short-term debt and current portion of long-term debt',
                        'Retained earnings (profits kept in the business)',
                    ],
                    [
                        'Inventory',
                        'Long-term debt',
                        'Treasury shares (stock bought back), shown as a negative',
                    ],
                    [
                        'Property, plant, and equipment',
                        'Lease liabilities',
                        'Accumulated other comprehensive income',
                    ],
                    ['Goodwill and intangibles', 'Pension obligations and deferred tax', ''],
                ],
            },
        },
        {
            heading: 'Check one: cash against short-term obligations',
            body: 'Start with liquidity: can the company pay its bills this year? Compare current assets, meaning cash, receivables, and inventory, against current liabilities, meaning everything due within twelve months.',
            table: {
                caption: 'Three liquidity measures, from loose to strict',
                headers: ['Measure', 'Calculation', 'What it assumes'],
                rows: [
                    [
                        'Current ratio',
                        'Current assets / current liabilities',
                        'That inventory can be sold and receivables collected on schedule. Generous.',
                    ],
                    [
                        'Quick ratio',
                        '(Current assets - inventory) / current liabilities',
                        'That inventory cannot be relied on. More realistic under stress.',
                    ],
                    [
                        'Cash ratio',
                        'Cash and equivalents / current liabilities',
                        'That nothing can be relied on except cash. The worst-case test.',
                    ],
                ],
                footnote:
                    'A current ratio comfortably above 1 is usually reassuring, but the quick ratio is the more honest reading for any business carrying large inventory.',
            },
            afterBody:
                "Be stricter when current assets are mostly inventory, which is the hardest thing to turn into cash in a hurry. A retailer with shelves full of last season's stock can pass the current-ratio test on paper and still hit a cash crunch, because the inventory only converts at a discount, if at all.",
        },
        {
            heading: 'Check two: the debt load and its deadline',
            body: 'Next, total debt: not just the amount but the schedule. Net debt, meaning total debt minus cash, relative to EBITDA is the standard gauge of how many years of operating earnings it would take to repay what is owed.',
            table: {
                caption: 'Reading net debt to EBITDA',
                headers: ['Level', 'Interpretation'],
                rows: [
                    [
                        'Below 1x',
                        'Conservative. The company has capacity to borrow if an opportunity appears.',
                    ],
                    ['1x to 2x', 'Comfortable for most industries.'],
                    [
                        '2x to 3x',
                        'Manageable if earnings are stable and predictable. Uncomfortable if they are cyclical.',
                    ],
                    [
                        'Above 4x',
                        'Demands an explanation. Small declines in earnings translate into large increases in risk.',
                    ],
                ],
                footnote:
                    'Acceptable leverage varies enormously by industry. A utility with regulated, predictable revenue can carry debt that would sink a semiconductor company.',
            },
            afterBody:
                'Then find the maturity schedule in the notes, because the same debt can be harmless or lethal depending on when it comes due. A company that borrowed cheaply years ago and faces refinancing at sharply higher rates has a problem the headline ratio does not show. Companies rarely collapse because debt is large; they collapse because it comes due at the worst possible moment, when refinancing is expensive or unavailable.',
        },
        {
            heading: 'Check three: what the assets are actually made of',
            body: 'Two asset types deserve particular suspicion, because both can be large, both look like value, and neither can be sold to pay a bill.',
            list: {
                items: [
                    'Goodwill. This is the premium paid above fair value in past acquisitions. It represents hope, not property. When an acquisition disappoints, goodwill is written down and equity takes the hit directly. A balance sheet where goodwill is a large share of total assets is a record of expensive shopping that still has to prove itself.',
                    'Receivables. Money owed by customers is an asset only if customers pay. If receivables grow much faster than revenue, the company may be booking sales that have not truly been paid for, or extending generous terms to keep sales moving. It is one of the oldest early warnings of earnings trouble.',
                ],
            },
            callout: {
                title: 'The quick sanity check',
                body: "Add goodwill and intangibles together and compare them to total equity. If they exceed it, the company's book value is entirely made of acquisition premiums and accounting estimates, and a single write-down can wipe out the equity on paper. That does not mean the business is bad, but it means book value tells you nothing useful about it.",
            },
        },
        {
            heading: 'Check four: the equity trend',
            body: 'Retained earnings, the accumulated profits kept in the business rather than paid out, should generally grow over time in a healthy company. Look at the direction across several years rather than the level in one.',
            afterBody:
                'A shrinking equity base alongside rising debt is a deteriorating story even when earnings look fine, because it means the company is consuming its own foundation. The exception worth knowing: heavy buybacks reduce equity deliberately, and can even push it negative in a very profitable, asset-light business. That is a capital allocation choice rather than a warning, but you have to check which one you are looking at.',
        },
        {
            heading: 'Check five: the quiet lines',
            body: 'Finally, skim the items that rarely make headlines and occasionally decide outcomes. None of this requires expertise, only the willingness to look.',
            list: {
                items: [
                    'Lease liabilities. Long-term leases are contractual obligations that behave like debt, and they are large in retail, airlines, and restaurants.',
                    'Pension obligations. An underfunded defined-benefit pension is a claim on future cash flow that sits outside the debt line.',
                    'Deferred revenue. Money collected for goods or services not yet delivered. It is technically a liability, but for a subscription business it is a good sign: customers have paid in advance.',
                    'Contingent liabilities. Anything in the notes about pending litigation, guarantees, or commitments. These are the items that turn into real numbers without warning.',
                    'Off-balance-sheet arrangements. Rarer than they were, but still worth a glance in the notes.',
                ],
            },
            afterBody:
                'Five minutes on these checks tells you whether the company is built on a foundation or a ledge, and that context changes how you read every other number it reports. The balance sheet will not tell you whether the stock is cheap. It will tell you whether the business gets to keep playing when conditions turn, which decides whether "cheap" ever gets the chance to matter.',
        },
    ],
}
