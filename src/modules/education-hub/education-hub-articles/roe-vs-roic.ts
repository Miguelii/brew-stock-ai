import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const ROE_VS_ROIC_ARTICLE: EducationHubArticle = {
    slug: 'roe-vs-roic',
    title: 'ROE vs. ROIC: The Two Numbers That Reveal a Quality Business',
    description:
        'Two companies post the same return on equity. One is a compounding machine, the other is drowning in debt. The metric that tells them apart is the one serious investors check first.',
    publishedAt: '2025-06-09',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 10,
    theme: 'stock-analysis',
    keyTakeaways: [
        'Margin tells you how much of each sale becomes profit. Return on capital tells you how much profit each invested dollar produces.',
        'ROE can be inflated by debt and buybacks without the business improving at all.',
        'ROIC counts debt and equity together, so it cannot be improved by financial engineering.',
        'A return on capital only means something next to the cost of that capital. Below it, growth destroys value.',
        'ROE and ROIC both high and close together, sustained for a decade, is one of the most reliable fingerprints of a moat.',
    ],
    sections: [
        {
            body: 'Ask a casual investor how profitable a company is and they will quote the profit margin. Ask a professional and they will quote a return on capital. The difference matters: margin tells you how much of each sale becomes profit, but returns on capital tell you how much profit the business generates for every dollar invested in it, which is the question that actually determines whether a company creates or destroys value over time. Two metrics dominate this conversation, and although they sound interchangeable, the gap between them is often where the most important truth about a business hides.',
        },
        {
            heading: 'ROE: elegant, popular, and easy to game',
            body: "Return on equity is net income divided by shareholders' equity: the profit generated on the capital that belongs to shareholders. A company earning $2 billion on $10 billion of equity has a 20% ROE, which by most standards is excellent. The problem is the denominator. Equity is what remains after debt, so a company can shrink its equity base by borrowing heavily or buying back shares, and its ROE rises without the underlying business improving at all.",
            table: {
                caption: 'The same business, financed two ways',
                headers: ['', 'Conservative', 'Leveraged'],
                rows: [
                    ['Operating profit', '$2.6bn', '$2.6bn'],
                    ['Debt', '$0bn', '$5bn'],
                    ['Interest cost', '$0m', '$250m'],
                    ['Net income (after 23% tax)', '$2.00bn', '$1.81bn'],
                    ["Shareholders' equity", '$10bn', '$5bn'],
                    ['Return on equity', '20.0%', '36.2%'],
                ],
                footnote:
                    'Illustrative. The leveraged column earns less profit and reports a far better ROE. Nothing about the operations changed; only the risk did.',
            },
            afterBody:
                'This is not a flaw in the arithmetic, it is the arithmetic working correctly. Leverage genuinely does amplify shareholder returns. It also amplifies losses, and a downturn that a debt-free company absorbs can be fatal to the same business carrying five billion in borrowings.',
        },
        {
            heading: 'ROIC: the same question, asked honestly',
            body: 'Return on invested capital divides operating profit after tax by all the capital invested in the business, equity and debt together. By counting both sources of funding, ROIC ignores financing choices and answers the cleaner question: how good is this company at turning capital into profit, regardless of where the capital came from?',
            afterBody:
                'Run the table above through ROIC and both columns give roughly the same answer, because the operating business is identical. That is the point. When analysts talk about "quality" companies, sustained high ROIC is usually the precise thing they mean, and it is the version of the question that a treasurer cannot improve with a phone call to a bank.',
        },
        {
            heading: 'The benchmark that gives the number meaning',
            body: 'A return on capital only becomes meaningful next to the cost of capital: the blended return that lenders and shareholders demand for funding the business. For a large, stable company that is often somewhere in the region of 8% to 10%, though it moves with interest rates and with the risk of the specific business.',
            table: {
                caption: 'What the spread over cost of capital implies',
                headers: ['ROIC vs cost of capital', 'What happens when the company reinvests'],
                rows: [
                    [
                        'Well above (say 20% vs 9%)',
                        'Every dollar reinvested creates value. Growth is genuinely worth paying for, and the company should retain earnings rather than pay them out.',
                    ],
                    [
                        'Roughly equal',
                        'Growth is value-neutral. The company is running to stand still, and cash might be better returned to shareholders.',
                    ],
                    [
                        'Below',
                        'Every dollar reinvested destroys value, even while the income statement shows a profit. Growth makes the problem larger.',
                    ],
                ],
            },
            afterBody:
                'That last row is the one people miss. A fast-growing company earning below its cost of capital is not an early-stage compounder, it is a machine converting investor money into a smaller amount of value at increasing scale. Growth is only good news conditional on the returns it earns.',
        },
        {
            heading: 'When the two numbers disagree',
            body: 'The most useful signal is the gap between them, because it isolates exactly how much of the shareholder return is coming from the business and how much from the balance sheet.',
            table: {
                caption: 'Reading the gap',
                headers: ['Pattern', 'What it usually means'],
                rows: [
                    [
                        'ROE high, ROIC high, close together',
                        'A genuinely superior business. Strong profitability with little financial engineering. This is the pattern behind most durable moats.',
                    ],
                    [
                        'ROE high, ROIC mediocre',
                        'Leverage is doing the heavy lifting. The business is ordinary and debt is amplifying both the return and the risk.',
                    ],
                    [
                        'ROE low, ROIC high',
                        'Unusual. Often a company sitting on a large cash pile, or one whose equity is inflated by past acquisitions.',
                    ],
                    [
                        'Both low',
                        'A capital-intensive business earning close to its cost of capital. It can still be a fine investment at the right price, but it will not compound.',
                    ],
                ],
            },
            callout: {
                title: 'One year proves nothing',
                body: 'Any company can post a high return on capital for a year, through a cyclical peak, an asset sale, or a temporary shortage in its market. What matters is persistence. A decade of ROIC comfortably above the cost of capital is evidence that something structural is protecting the business, because otherwise competition would have closed the gap.',
            },
        },
        {
            heading: 'Where the numbers mislead',
            body: 'Both metrics have blind spots, and knowing them prevents most of the wrong conclusions.',
            list: {
                items: [
                    'Acquisitions inflate invested capital. A company that grew by buying others carries goodwill in the denominator, which depresses ROIC. Some analysts strip goodwill out to see the operating return, but the money was genuinely spent, so removing it flatters the capital allocation record.',
                    'Buybacks shrink equity, sometimes below zero. A very profitable, asset-light company can repurchase enough stock to report negative equity, at which point ROE becomes meaningless rather than infinite.',
                    'Old assets flatter returns. Fully depreciated factories still produce goods while contributing almost nothing to the capital base, which makes ageing asset-heavy businesses look better than they are.',
                    'Financial companies are different. For banks and insurers, debt is raw material rather than financing, so ROIC does not apply and ROE against the regulatory capital base is the standard measure instead.',
                    'Sector norms vary enormously. Utilities and airlines structurally earn less on capital than software or branded consumer goods, and comparing across those lines tells you about industry economics, not about management.',
                ],
            },
        },
        {
            heading: 'How to use them in practice',
            body: 'A short routine extracts most of the value in a few minutes.',
            list: {
                ordered: true,
                items: [
                    "Check ROIC first, against a rough cost-of-capital hurdle and against the company's own ten-year history. Stable or rising ROIC above 15% is a strong signal.",
                    'Then look at ROE alongside the debt load. If ROE towers over ROIC, find out how much borrowing creates the difference and decide whether that leverage is sensible or fragile.',
                    'Compare against three or four direct peers, never against a universal scoreboard.',
                    'Check the direction of travel over a decade. A falling ROIC in a company still earning good absolute returns is a moat narrating its own erosion.',
                    'Ask how much capital the company can actually reinvest at those returns. A 40% ROIC business with nowhere to deploy new money compounds no faster than a 12% one that can reinvest everything.',
                ],
            },
            afterBody:
                'That final point is the one that separates a good business from a good investment. Neither number replaces reading the business, but together they tell you, faster than almost anything else, whether you are looking at a compounder or a treadmill.',
        },
    ],
}
