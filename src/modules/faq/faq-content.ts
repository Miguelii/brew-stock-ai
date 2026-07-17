export type FaqItem = {
    question: string
    answer: string
}

type FaqGroup = {
    heading: string
    items: readonly FaqItem[]
}

export const PRICING_FAQ = [
    {
        question: 'Do credits expire?',
        answer: 'No. Credits never expire. Buy a package once and use it whenever you need.',
    },
    {
        question: 'Is this a subscription?',
        answer: 'No. There are no subscriptions, recurring charges, or hidden fees. You only pay when you choose to buy a credit package.',
    },
    {
        question: 'How much does one analysis cost?',
        answer: 'An analysis costs 1 or 2 credits depending on its depth. Lighter analyses like Risk, Moat, and Growth Potential cost 1 credit; the Full Wall Street Style Analysis and the Deep Financial Breakdown cost 2 credits each.',
    },
    {
        question: 'Can I try it for free?',
        answer: 'Yes. Every new account starts with 2 free trial credits, enough for your first full analysis. No card required.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'Payments are processed securely by Stripe, which supports major credit and debit cards plus popular local payment methods.',
    },
] as const

export const FAQ_GROUPS = [
    {
        heading: 'The Product',
        items: [
            {
                question: 'What is BrewStockAI?',
                answer: 'BrewStockAI is an AI-powered stock research tool. You enter a ticker, choose the type of analysis you want, and within about two minutes you receive a structured research report covering the investment thesis, key financial metrics, analyst outlook, recent developments, and sector positioning.',
            },
            {
                question: 'What types of analysis can I run?',
                answer: 'There are five analysis types: a Full Wall Street Style Stock Analysis, a Deep Financial Breakdown, a Competitive Advantage (Moat) Analysis, a Risk Analysis, and a Growth Potential Analysis. Each one looks at the same underlying data from a different angle, so you can match the report to the question you are actually trying to answer.',
            },
            {
                question: 'Which stocks are supported?',
                answer: 'You can analyze publicly traded companies by their stock ticker, including major US-listed stocks across technology, finance, healthcare, consumer, energy, and other sectors. If a ticker has the underlying financial data available, BrewStockAI can analyze it.',
            },
        ],
    },
    {
        heading: 'How the AI Works',
        items: [
            {
                question: 'What data does the AI use?',
                answer: 'Before writing a single word, the AI gathers real data about the company. That includes recent earnings results, estimates for future earnings and revenue, several years of revenue and profit trends, analyst ratings, recent insider buying and selling, price signals such as moving averages, and the latest company news.',
            },
            {
                question: 'How is the analysis actually produced?',
                answer: 'The AI weighs the evidence the way a disciplined analyst would: fundamentals first, with technical signals and news treated as confirming or challenging signals rather than the core of the case. The output is a structured report where the numbers used in the reasoning are shown alongside the written analysis.',
            },
            {
                question: 'How accurate is it? What are the limitations?',
                answer: 'Reports are grounded in real financial data, but no analysis, human or AI, can predict the market. AI models can also make mistakes or miss context. Treat every report as a well-organized starting point for your own research, not as a verdict. Always verify the points that matter to your decision.',
            },
            {
                question: 'Is this financial advice?',
                answer: 'No. BrewStockAI is an educational and informational research tool. It does not provide personalized investment advice, and nothing in a report is a recommendation to buy or sell any security. Read our full disclaimer for details.',
            },
        ],
    },
    {
        heading: 'Credits & Billing',
        items: PRICING_FAQ,
    },
    {
        heading: 'Account & Privacy',
        items: [
            {
                question: 'What happens to my data?',
                answer: 'We collect only what is needed to run the service: your account details, the reports you generate, and payment records processed securely by Stripe. We do not sell your personal data. Our privacy notice explains exactly what is stored, why, and for how long.',
            },
            {
                question: 'Can I delete my account?',
                answer: 'Yes. You can request account deletion at any time through the contact page, and we will remove your account and associated personal data in line with our privacy notice.',
            },
            {
                question: 'How do I get help?',
                answer: 'Use the contact page to reach us directly. We read every message and respond as soon as possible.',
            },
        ],
    },
] as const satisfies readonly FaqGroup[]
