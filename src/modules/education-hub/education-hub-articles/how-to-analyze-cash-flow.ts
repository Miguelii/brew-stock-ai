import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_TO_ANALYZE_CASH_FLOW_ARTICLE: EducationHubArticle = {
    slug: 'how-to-analyze-cash-flow',
    title: 'How to Analyse Cash Flow: Why It Matters More Than Profit',
    description:
        'Profit is an opinion; cash is a fact. Learn what free cash flow reveals that the income statement hides, and the patterns that warn you before the market notices.',
    publishedAt: '2025-05-01',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 10,
    theme: 'stock-analysis',
    keyTakeaways: [
        'Profit is calculated under accrual rules and involves judgement. Cash movements are observable facts.',
        'Operating cash flow is the number to read first, and the one hardest to dress up.',
        'Free cash flow is operating cash flow minus capital expenditure: what is genuinely left over.',
        'A widening gap between rising net income and flat operating cash flow is one of the most reliable warning signs in investing.',
        'Negative free cash flow is a problem for a mature business and often a good sign for a young one. Context decides.',
    ],
    sections: [
        {
            body: '"Revenue is vanity, profit is sanity, cash flow is reality." The adage survives because it keeps being proven right: companies report healthy profits and run out of cash, and companies report losses while quietly generating mountains of it. Learning to read cash flow is the closest thing investing has to a lie detector for the income statement.',
        },
        {
            heading: 'The three sections of the cash flow statement',
            body: 'Every public company publishes one statement split into three sections. They answer different questions, and the order you read them in matters.',
            table: {
                caption: 'What each section tells you',
                headers: ['Section', 'What it captures', 'What it reveals'],
                rows: [
                    [
                        'Operating',
                        'Cash collected from customers minus cash paid to suppliers, staff, and tax authorities.',
                        'Whether the core business generates money. The most important line on the statement.',
                    ],
                    [
                        'Investing',
                        'Capital expenditure, acquisitions, and purchases or sales of investments.',
                        'What the company is spending to maintain and grow itself, and whether it is buying growth rather than building it.',
                    ],
                    [
                        'Financing',
                        'Debt raised or repaid, shares issued or repurchased, dividends paid.',
                        'Who is funding the company, and whether shareholder returns are funded by the business or by borrowing.',
                    ],
                ],
            },
            afterBody:
                'Read operating first. If a company cannot generate cash from operations over a full cycle, nothing in the other two sections fixes that; it only determines how long the problem can be deferred.',
        },
        {
            heading: 'Why profit can be misleading',
            body: 'Accounting profit uses accrual rules: revenue is booked when it is earned, not when the cash lands, and costs are matched to the period they relate to rather than the period they are paid in. This is deliberate and usually sensible, because it stops timing noise from obscuring performance. But it inserts judgement between reality and the reported number.',
            list: {
                items: [
                    'A sale made on credit in December is revenue in December, whether payment arrives in March or never arrives at all.',
                    'Depreciation reduces reported profit without any money leaving the bank this year.',
                    'Inventory built but not sold sits on the balance sheet, so the cash spent making it does not appear as a cost yet.',
                    'Capitalised costs, such as software development, become an asset rather than an expense, flattering current profit.',
                ],
            },
            afterBody:
                'Every one of these is legitimate accounting. Together they mean two companies can post identical net income while one is flush with cash and the other is quietly running on fumes. The income statement tells you a story; the cash flow statement tells you whether it is true.',
        },
        {
            heading: 'The gap that matters',
            body: 'The single most useful cash flow exercise is comparing net income against operating cash flow over several years. In a healthy business the two move together, with operating cash flow usually somewhat higher because depreciation is added back.',
            table: {
                caption: 'Two companies, identical reported profit',
                headers: ['', 'Company A', 'Company B'],
                rows: [
                    ['Net income, year 1', '$100m', '$100m'],
                    ['Net income, year 3', '$130m', '$130m'],
                    ['Operating cash flow, year 1', '$118m', '$115m'],
                    ['Operating cash flow, year 3', '$152m', '$96m'],
                    [
                        'Receivables growth over the period',
                        'In line with revenue',
                        'Roughly twice revenue growth',
                    ],
                ],
                footnote:
                    'Illustrative. Identical earnings growth on the income statement. Company B is booking sales its customers have not paid for.',
            },
            afterBody:
                'A persistent and widening divergence between rising profit and stagnant operating cash flow has preceded a large share of accounting scandals and a much larger share of ordinary disappointments. It does not prove anything is wrong. It does mean the question deserves an answer before you buy.',
        },
        {
            heading: 'Free cash flow: the number that is hard to fake',
            body: 'Free cash flow is operating cash flow minus capital expenditure: the cash left over after the business has paid to maintain and grow itself. It is what actually funds dividends, buybacks, debt reduction, and acquisitions without borrowing, and it is far harder to manipulate than earnings because it nets out most accounting judgement.',
            callout: {
                title: 'Free cash flow yield',
                body: 'Divide free cash flow per share by the share price. A company generating $5 of free cash flow per share at a $100 price has a 5% yield: a real cash return that does not rest on accounting assumptions. It is directly comparable to a bond yield, which makes it one of the few valuation measures that means something without a peer group.',
            },
            afterBody:
                'One nuance separates maintenance capital expenditure, the spending needed just to keep the existing business running, from growth capital expenditure, which builds new capacity. Companies rarely split them out, but the distinction matters: a business with negative free cash flow because it is building new factories is in a completely different position from one with negative free cash flow because its existing factories need replacing.',
        },
        {
            heading: 'When negative free cash flow is fine',
            body: 'Low or negative free cash flow is not automatically bad. It depends entirely on what the cash is being spent on and whether the spending has an end.',
            table: {
                caption: 'Reading negative free cash flow',
                headers: ['Situation', 'Concerning?', 'What to check'],
                rows: [
                    [
                        'Young company building capacity ahead of demand',
                        'Usually not',
                        'Whether unit economics are positive and the spending is discretionary. Can they stop and still operate?',
                    ],
                    [
                        'Mature company, capex rising with flat revenue',
                        'Yes',
                        'Whether this is replacement spending. If so, the business was never as profitable as reported.',
                    ],
                    [
                        'One-off large project or acquisition',
                        'Usually not',
                        'Whether it is genuinely one-off. Check the prior three years.',
                    ],
                    [
                        'Working capital swallowing the cash',
                        'Depends',
                        'Whether inventory or receivables are growing faster than sales. That is a deteriorating trend, not a growth investment.',
                    ],
                ],
            },
        },
        {
            heading: 'Red flags worth acting on',
            body: 'A few patterns justify serious scepticism regardless of how good the rest of the numbers look.',
            list: {
                ordered: true,
                items: [
                    'Net income climbing while operating cash flow stalls or falls, especially for more than two consecutive years.',
                    'Receivables or inventory growing materially faster than revenue, which means sales are being booked ahead of cash or goods are not selling.',
                    'A dividend or buyback funded by new debt rather than by free cash flow. This is generosity the company cannot afford, and it usually ends by being withdrawn.',
                    'Capital expenditure rising quickly without any corresponding revenue growth arriving a year or two later.',
                    'Repeated reliance on asset sales or one-off items to keep operating cash flow positive.',
                    'A growing gap between adjusted EBITDA and actual operating cash flow, which usually means the adjustments are hiding a real cost.',
                ],
            },
            afterBody:
                'None of these guarantee trouble, and plenty of good companies show one of them briefly for a defensible reason. But each of them is a question, and a company that cannot answer it clearly has told you something useful. Cash flow will not tell you whether a stock is cheap. It will tell you whether the profits you are valuing actually exist.',
        },
    ],
}
