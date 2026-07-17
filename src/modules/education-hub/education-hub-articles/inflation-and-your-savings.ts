import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const INFLATION_AND_YOUR_SAVINGS_ARTICLE: EducationHubArticle = {
    slug: 'inflation-and-your-savings',
    title: 'Inflation: The Silent Tax on Cash (and What Beats It)',
    description:
        'At 3% inflation, money sitting in a current account loses a quarter of its purchasing power in ten years. Here is how the erosion works and what has historically outrun it.',
    publishedAt: '2026-03-30',
    readingTimeMinutes: 5,
    theme: 'personal-finance',
    sections: [
        {
            body: 'A saver who kept €10,000 in a zero-interest account through the inflation surge of 2021-2023 still has €10,000, and lost roughly €1,500 of purchasing power. Nothing was stolen, no statement showed a loss, and that is exactly what makes inflation the most underestimated risk in personal finance: it is a tax that never sends a bill. Cash feels like the safe option because its number never goes down. But the number was never the point; what the number buys is, and that has been shrinking for as long as money has existed.',
        },
        {
            heading: 'The Arithmetic of Quiet Erosion',
            body: 'Inflation compounds with the same exponential math as investment returns, just pointed at you. At the central-bank target of 2%, prices double roughly every 35 years. At 3%, purchasing power drops by about a quarter in ten years. At the 8-10% peaks several economies touched in 2022, cash lost close to a tenth of its real value in a single year. The mirror-image rule of 72 applies: divide 72 by the inflation rate to get the years until prices double. This is why "I am not investing, so I am not taking risk" is an illusion; holding cash is an investment position with a reliably negative real return.',
        },
        {
            heading: 'Real Versus Nominal: The Only Return That Matters',
            body: 'Every return has two versions. The nominal return is the number on your statement; the real return is what is left after inflation. A savings account paying 4% during 6% inflation is losing 2% a year in real terms: the balance grows while its buying power shrinks. The discipline is to subtract inflation from every return you are quoted before deciding if it impresses you. Historically, equities have returned roughly 6-7% per year in real terms over long horizons; cash and short-term deposits have hovered around zero real, and frequently below. The entire case for investing is contained in that gap.',
        },
        {
            heading: 'What Has Actually Beaten Inflation',
            body: 'The long-run evidence is unusually clear. Stocks are the most reliable inflation-beater over decades, because businesses raise their prices too, so their revenues and profits inflate along with the economy, and ownership of productive assets has outrun every sustained inflationary period in modern market history. Property has a similar logic through rents. Inflation-linked government bonds compensate by contract. Gold has protected purchasing power over very long stretches but goes decades misbehaving. The clean failures are cash and conventional long-term bonds, which is precisely the pairing most cautious savers hold. Over short windows stocks are far riskier than cash; over twenty-year windows, history says the ranking reverses.',
        },
        {
            heading: 'The 2021-2023 Reminder',
            body: "The recent surge was a compressed masterclass. Savers who had grown used to 1-2% inflation watched prices jump near double digits while deposit rates lagged far behind, a punishing real-terms loss in barely two years. It also showed inflation's second-order effects on markets themselves: central banks responded with the fastest rate hikes in decades, which repriced stocks and bonds alike, a mechanism explored in our guide to how interest rates move stocks. The episode's lesson is not that inflation always rages (it usually settles back toward target), but that the protection has to be in place before the surge, because by the time inflation is in the headlines, the erosion is already underway.",
        },
        {
            heading: 'A Sensible Defense',
            body: 'The goal is not to eliminate cash. An emergency buffer must stay liquid and safe, and that is a fair price for stability. The goal is to stop using cash as a long-term store of value. Keep the buffer in the highest-yielding safe account available, so the real loss is minimised. Put genuinely long-term money into productive assets, with broad stock index funds as the default core, sized to your horizon and temperament. And run the real-return check on everything: any money expected to sit for a decade in an asset yielding less than inflation is not being kept safe; it is being slowly spent.',
        },
    ],
}
