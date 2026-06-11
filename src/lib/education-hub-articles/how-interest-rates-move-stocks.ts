import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_INTEREST_RATES_MOVE_STOCKS_ARTICLE: EducationHubArticle = {
    slug: 'how-interest-rates-move-stocks',
    title: 'How Interest Rates Move Stock Prices (and Why 2022 Proved It)',
    description:
        'In 2022 the Nasdaq fell by a third while the economy kept growing. The cause was not earnings — it was the discount rate. Here is the machinery connecting central banks to your portfolio.',
    publishedAt: '2025-11-24',
    readingTimeMinutes: 6,
    theme: 'investing-strategy',
    sections: [
        {
            body: 'In 2022, the US economy added millions of jobs, corporate revenues grew, and the Nasdaq still lost roughly a third of its value. Investors looking for the explanation in earnings reports were looking in the wrong place. The driver was the fastest interest-rate hiking cycle in four decades, and the episode was a brutal public lesson in the single most important relationship in markets: when the price of money changes, the value of everything priced in money gets recalculated.',
        },
        {
            heading: 'The Gravity Metaphor',
            body: 'Warren Buffett calls interest rates "gravity" for asset prices, and the metaphor is precise. A stock is a claim on future cash flows, and those future cash flows must be discounted back to today at a rate anchored to what risk-free government bonds pay. When the risk-free rate is near zero, future profits are barely discounted and almost any price can be rationalised. When it jumps to 5%, every future dollar is worth meaningfully less today — and the further away that dollar sits, the harder it falls. Rates went from gravity-off to gravity-on in twelve months, and valuations fell to earth accordingly.',
        },
        {
            heading: 'Channel One: The Competition for Your Capital',
            body: 'The first mechanism is simple competition. Stocks must offer enough expected return to justify their risk over the safe alternative. When cash and short-term government bonds pay essentially nothing, a stock with a 4% earnings yield looks attractive by default — the famous "there is no alternative" trade. When the same bonds suddenly pay 5% guaranteed, that stock needs a higher earnings yield to compete, and the only way an existing stock\'s earnings yield rises quickly is for its price to fall. Money does not need a catastrophe to leave equities; it just needs a better-paying alternative.',
        },
        {
            heading: 'Channel Two: Why Growth Stocks Fall Hardest',
            body: "Discounting explains 2022's strange scoreboard, where profitless growth darlings fell 60-80% while oil majors and insurers rose. A speculative company's value lives almost entirely in large profits imagined a decade out — and distant cash flows are exactly the ones that exponential discounting punishes most. A mature business earning solid cash today has most of its value close to the present, where higher rates barely bite. This is the mechanism behind the growth-versus-value seesaw covered in our growth and value guide: rate regimes, more than fashion, decide which style the market rewards.",
        },
        {
            heading: 'Channel Three: The Real Economy Catches Up Later',
            body: 'Beyond the math, rates eventually hit the earnings themselves. Companies refinancing debt face higher interest costs that come straight out of profit. Consumers with costlier mortgages and credit cards spend less. Banks tighten lending, projects get shelved, hiring slows. This channel works with a long lag — often a year or more — which produces a recurring pattern that confuses investors: markets fall on the announcement of higher rates (the discounting effect is instant), then wrestle with the earnings consequences several quarters later. The valuation hit and the economic hit are separate punches, and they rarely land at the same time.',
        },
        {
            heading: 'What an Investor Should Actually Do With This',
            body: "Not forecast rates — almost nobody does it reliably, including the professionals paid to. The realistic uses are humbler. Understand your portfolio's sensitivity: long-duration assets (high-multiple growth, unprofitable companies, long bonds) swing hardest with rates, while near-term cash generators are steadier. Read valuations in context — a P/E of 30 means something different at 1% rates than at 5%. Treat rate-driven crashes differently from earnings-driven ones: 2022 repriced good businesses without breaking them, and investors who recognised that distinction bought quality at a discount. The companies were the same in January and December; only gravity had changed.",
        },
    ],
}
