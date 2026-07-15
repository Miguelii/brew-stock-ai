import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const BEHAVIORAL_BIASES_INVESTING_ARTICLE: EducationHubArticle = {
    slug: 'behavioral-biases-investing',
    title: 'The Five Behavioral Biases That Cost Investors the Most',
    description:
        'Fund investors reliably earn less than the funds they invest in — a gap caused entirely by their own behaviour. These are the five instincts responsible, and the guardrails that contain them.',
    publishedAt: '2026-01-19',
    readingTimeMinutes: 6,
    theme: 'investing-strategy',
    sections: [
        {
            body: "Morningstar runs a study every year with a finding that should be framed on every investor's wall: the average fund investor earns meaningfully less than the average fund they invest in — historically somewhere around one to two percentage points per year. The funds did fine; the investors' timing of when they bought and sold them destroyed the difference. No fee, no tax, no market crash causes that gap. Behaviour does. Decades of behavioral finance research, much of it from Daniel Kahneman and Amos Tversky, explain exactly which instincts are responsible — and they live in all of us.",
        },
        {
            heading: 'Loss Aversion: Losses Hurt Twice as Much',
            body: 'Kahneman and Tversky\'s core finding is that the pain of a loss is roughly twice as intense as the pleasure of an equivalent gain. In portfolios this produces a signature mistake pair: selling winners too early to "lock in" the good feeling, while clinging to losers because selling would convert a paper loss into a real, painful one. The result is a portfolio that systematically harvests its flowers and waters its weeds. The stock does not know your purchase price — but loss aversion guarantees that you never forget it, and that you make decisions to protect your feelings rather than your returns.',
        },
        {
            heading: 'Recency Bias: The Last Year, Extended Forever',
            body: 'Humans instinctively weight recent experience over long-run base rates. After a strong year, investors extrapolate strong years; after a crash, they brace for permanent crashes. This is the engine of buying high and selling low at the level of entire markets: record fund inflows reliably arrive after big rallies, and record outflows after big declines — the exact opposite of buy low, sell high, executed at scale. The investors who sold in March 2020 and waited for things to "feel safe" again repurchased the same assets months later at far higher prices. The recent past is the most vivid information you have and usually the least predictive.',
        },
        {
            heading: 'Confirmation Bias: Research as a Search for Applause',
            body: 'Once you own a stock, your relationship to information about it changes. Bullish articles feel insightful; warnings feel ignorant or malicious. Holders of a falling stock often respond by seeking out communities of fellow believers — converting research, which should be an attempt to find disconfirming evidence, into a ritual of reassurance. The practical damage is asymmetric: confirmation bias rarely hurts you on the stocks you decided against, but it can keep you in a deteriorating thesis for years. The discipline that counters it is uncomfortable by design: actively write down what would prove you wrong, before you need the answer.',
        },
        {
            heading: 'Overconfidence and Herding: The Expensive Pair',
            body: "Overconfidence shows up in the data as overtrading: Brad Barber and Terrance Odean's landmark study of retail brokerage accounts found the most active traders underperformed the market by several points a year, with men trading more and earning less than women — activity driven by confidence, not information. Herding is its social twin: the deep instinct that safety lies where the crowd is. In markets the crowd's comfort is inverted — assets feel safest at the top, when everyone agrees, and most dangerous at the bottom, when bargains are everywhere. Dot-com 1999, housing 2006, and meme stocks 2021 were all, at the time, where the crowd felt warmest.",
        },
        {
            heading: 'Guardrails Beat Willpower',
            body: 'The uncomfortable conclusion of behavioral finance is that knowing about biases barely protects you from them — Kahneman himself said he never overcame his own. What works is removing decisions from the moments when biases peak. Automate regular investing so recency bias never gets a vote. Write the thesis and the exit conditions when you buy, so future-you argues with evidence rather than emotion. Impose a waiting period on every panic-driven action. Check the portfolio on a schedule, not on every red day. None of this is sophisticated, which is precisely the point: in a game where the average participant loses one to two points a year to their own instincts, the durable edge is not being smarter — it is being structurally harder to provoke.',
        },
    ],
}
