import type { Metadata } from 'next'
import Link from 'next/link'
import * as motion from 'motion/react-client'
import { ClientEnv } from '@/env/client'
import { BreadcrumbSchema, FAQSchema } from '@/components/structured-data'

export const dynamic = 'force-static'

const SITE_URL = ClientEnv.NEXT_PUBLIC_WEBSITE_URL
const META_TITLE = 'Frequently Asked Questions'
const META_DESCRIPTION =
    'Everything you need to know about StockBrewAI: how the AI analysis works, where the data comes from, what reports include, pricing, and data privacy.'
const META_URL = `${SITE_URL}/faq`

export const metadata: Metadata = {
    title: META_TITLE,
    description: META_DESCRIPTION,
    alternates: {
        canonical: META_URL,
    },
    openGraph: {
        title: META_TITLE,
        description: META_DESCRIPTION,
        url: META_URL,
    },
    twitter: {
        title: META_TITLE,
        description: META_DESCRIPTION,
    },
}

const FAQ_GROUPS = [
    {
        heading: 'The Product',
        items: [
            {
                question: 'What is StockBrewAI?',
                answer: 'StockBrewAI is an AI-powered stock research tool. You enter a ticker, choose the type of analysis you want, and within about two minutes you receive a structured research report covering the investment thesis, key financial metrics, analyst outlook, recent developments, and sector positioning.',
            },
            {
                question: 'What types of analysis can I run?',
                answer: 'There are five analysis types: a Full Wall Street Style Stock Analysis, a Deep Financial Breakdown, a Competitive Advantage (Moat) Analysis, a Risk Analysis, and a Growth Potential Analysis. Each one looks at the same underlying data from a different angle, so you can match the report to the question you are actually trying to answer.',
            },
            {
                question: 'Which stocks are supported?',
                answer: 'You can analyze publicly traded companies by their stock ticker, including major US-listed stocks across technology, finance, healthcare, consumer, energy, and other sectors. If a ticker has the underlying financial data available, StockBrewAI can analyze it.',
            },
        ],
    },
    {
        heading: 'How the AI Works',
        items: [
            {
                question: 'What data does the AI use?',
                answer: 'Before writing a single word, the AI gathers the company’s recent earnings history including beats and misses, forward EPS and revenue estimates, multi-year revenue and net income trends, the full analyst rating distribution, recent insider buying and selling, technical signals such as moving averages and RSI, and the latest company news.',
            },
            {
                question: 'How is the analysis actually produced?',
                answer: 'The AI weighs the evidence the way a disciplined analyst would: fundamentals first, with technical signals and news treated as confirming or challenging signals rather than the core of the case. The output is a structured report where the numbers used in the reasoning are shown alongside the written analysis.',
            },
            {
                question: 'How accurate is it? What are the limitations?',
                answer: 'Reports are grounded in real financial data, but no analysis — human or AI — can predict the market. AI models can also make mistakes or miss context. Treat every report as a well-organized starting point for your own research, not as a verdict. Always verify the points that matter to your decision.',
            },
            {
                question: 'Is this financial advice?',
                answer: 'No. StockBrewAI is an educational and informational research tool. It does not provide personalized investment advice, and nothing in a report is a recommendation to buy or sell any security. Read our full disclaimer for details.',
            },
        ],
    },
    {
        heading: 'Credits & Billing',
        items: [
            {
                question: 'How does pricing work?',
                answer: 'StockBrewAI is pay-as-you-go. You buy a package of credits once and spend them on reports whenever you want — there is no subscription and no recurring charge. Focused analyses cost 1 credit and the most comprehensive ones cost 2.',
            },
            {
                question: 'Is there a free trial?',
                answer: 'Yes. Every new account starts with 2 free trial credits, which is enough for your first full analysis. No card is required to try it.',
            },
            {
                question: 'Do credits expire?',
                answer: 'No. Credits never expire. Whatever you buy stays in your account until you use it.',
            },
        ],
    },
    {
        heading: 'Account & Privacy',
        items: [
            {
                question: 'What happens to my data?',
                answer: 'We collect only what is needed to run the service — your account details, the reports you generate, and payment records processed securely by Stripe. We do not sell your personal data. Our privacy notice explains exactly what is stored, why, and for how long.',
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
] as const

const ALL_QUESTIONS = FAQ_GROUPS.flatMap((group) =>
    group.items.map(({ question, answer }) => ({ question, answer }))
)

export default function FaqPage() {
    return (
        <>
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: `${SITE_URL}/` },
                    { name: META_TITLE, url: META_URL },
                ]}
            />
            <FAQSchema questions={ALL_QUESTIONS} />

            <main className="max-w-5xl mx-auto px-6 py-12 lg:pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-8%' }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                        Frequently Asked Questions (FAQ&apos;s)
                    </h1>
                    <p className="text-primary-muted text-lg leading-relaxed max-w-2xl">
                        How the analysis works, where the data comes from, what reports include, and
                        how credits and billing work. Can&apos;t find your answer?{' '}
                        <Link
                            href="/contact"
                            className="text-accent-blue underline underline-offset-4"
                        >
                            Contact us
                        </Link>
                        .
                    </p>
                </motion.div>

                <div className="space-y-14">
                    {FAQ_GROUPS.map((group) => (
                        <motion.section
                            key={group.heading}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-8%' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h2 className="text-2xl font-bold tracking-tight mb-6">
                                {group.heading}
                            </h2>
                            <div className="space-y-8">
                                {group.items.map((item) => (
                                    <div key={item.question}>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {item.question}
                                        </h3>
                                        <p className="text-primary-muted leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </main>
        </>
    )
}
