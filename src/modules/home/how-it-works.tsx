const STEPS = [
    {
        title: 'Pick a stock',
        description:
            'Type in any ticker — from household names like Apple or Microsoft to the small-cap you just read about. Then choose the angle you care about: a full Wall Street style analysis, a deep financial breakdown, a competitive moat review, a risk assessment, or a growth potential study.',
    },
    {
        title: 'The AI does the research',
        description:
            'Our engine pulls the company’s recent earnings history — beats and misses, forward EPS and revenue estimates — alongside the full analyst rating distribution, insider buying and selling, technical signals like moving averages and RSI, and the latest company news. It weighs that evidence the way a disciplined analyst would: fundamentals first, technicals and headlines as confirming signals.',
    },
    {
        title: 'Read a structured report',
        description:
            'In under two minutes you get a structured report you can actually act on. Every claim is grounded in the underlying data, and the numbers used in the analysis are shown right next to it.',
    },
] as const

export function HowItWorks() {
    return (
        <section className="border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
                <div className="mb-16 max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        What StockBrewAI Actually Does
                    </h2>
                    <div className="space-y-4 text-primary-muted leading-relaxed text-lg">
                        <p>
                            StockBrewAI processes earnings reports, balance sheets, and market data
                            the same way professional analysts do. You get the output in under 2
                            minutes for less than a coffee.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {STEPS.map((step, i) => (
                        <div key={step.title} className="flex flex-col gap-4">
                            <span className="w-11 h-11 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue font-mono font-bold text-lg">
                                {i + 1}
                            </span>
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="text-primary-muted leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
