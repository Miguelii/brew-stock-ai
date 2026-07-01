import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const ROE_VS_ROIC_ARTICLE: EducationHubArticle = {
    slug: 'roe-vs-roic',
    title: 'ROE vs. ROIC: The Two Numbers That Reveal a Quality Business',
    description:
        'Two companies post the same return on equity — one is a compounding machine, the other is drowning in debt. The metric that tells them apart is the one serious investors check first.',
    publishedAt: '2025-06-09',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Ask a casual investor how profitable a company is and they will quote the profit margin. Ask a professional and they will quote a return on capital. The difference matters: margin tells you how much of each sale becomes profit, but returns on capital tell you how much profit the business generates for every dollar invested in it — which is the question that actually determines whether a company creates or destroys value over time. Two metrics dominate this conversation, ROE and ROIC, and although they sound interchangeable, the gap between them is often where the most important truth about a business hides.',
        },
        {
            heading: 'ROE: Elegant, Popular, and Easy to Game',
            body: "Return on equity is net income divided by shareholders' equity — the profit generated on the capital that belongs to shareholders. A company earning $2 billion on $10 billion of equity has a 20% ROE, which by most standards is excellent. The problem is the denominator. Equity is what remains after debt, so a company can shrink its equity base by borrowing heavily or buying back shares, and its ROE rises without the underlying business improving at all. Earn the same $2 billion on $5 billion of equity after loading up on debt, and ROE doubles to 40% while the business itself has not changed — only its fragility has.",
        },
        {
            heading: 'ROIC: The Same Question, Asked Honestly',
            body: 'Return on invested capital divides operating profit after tax by all the capital invested in the business — equity and debt together. By counting both sources of funding, ROIC ignores financing tricks and answers the cleaner question: how good is this company at turning capital into profit, regardless of where the capital came from? A business earning 25% on its total invested capital is genuinely exceptional. One earning 6% is treading water, because that is roughly what the capital costs in the first place. When analysts talk about "quality" companies, sustained high ROIC is usually the precise thing they mean.',
        },
        {
            heading: 'The Benchmark That Gives the Number Meaning',
            body: 'ROIC only becomes meaningful next to the cost of capital — the blended return that debt holders and shareholders demand for funding the business, typically somewhere around 8-10% for a large company. A company earning an ROIC above its cost of capital creates value with every dollar it reinvests; one earning below it destroys value even while reporting profits. This is the engine behind long-term compounding: a business that can reinvest large amounts at 20%+ returns, year after year, grows intrinsic value relentlessly. It is also why a fast-growing company with a low ROIC can be a trap — growth funded at returns below the cost of capital makes the problem bigger, not better.',
        },
        {
            heading: 'When the Two Numbers Disagree',
            body: 'The most useful signal is the gap. When ROE is high but ROIC is mediocre, leverage is usually doing the heavy lifting — the business is ordinary, but debt is amplifying the equity return, along with the risk. Some businesses run this model deliberately and survive on stability, but the equity holders are carrying more danger than the headline ROE suggests. When ROE and ROIC are both high and close together, you are usually looking at a genuinely superior business: strong profitability achieved without financial engineering. That pattern, sustained over five to ten years, is one of the most reliable fingerprints of a durable competitive moat.',
        },
        {
            heading: 'How to Use Them in Practice',
            body: "Check ROIC first, against the rough 10% cost-of-capital hurdle and against the company's own history — a stable or rising ROIC above 15% over a decade is a strong signal. Then look at ROE alongside the balance sheet: if it towers above ROIC, find out how much debt is creating the difference and decide whether that leverage is sensible or fragile. Finally, be sector-aware. Asset-heavy industries like utilities and airlines run structurally lower returns on capital than software or branded consumer goods, so compare companies against their peers, not against a universal scoreboard. Neither number replaces reading the business — but together they tell you, faster than almost anything else, whether you are looking at a compounder or a treadmill.",
        },
    ],
}
