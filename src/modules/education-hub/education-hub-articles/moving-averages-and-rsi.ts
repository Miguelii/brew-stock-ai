import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const MOVING_AVERAGES_AND_RSI_ARTICLE: EducationHubArticle = {
    slug: 'moving-averages-and-rsi',
    title: "Moving Averages and RSI: A Fundamental Investor's Guide to Technical Signals",
    description:
        'You do not have to become a chart trader to use technical signals. Two indicators, the moving average and RSI, can sharpen your entries and flag trouble the fundamentals have not reported yet.',
    publishedAt: '2025-10-27',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Fundamental investors love to dismiss technical analysis as astrology with charts, and plenty of it deserves the scorn. But two of its tools have survived every fad cycle for a simple reason: they compress real information about supply, demand, and crowd behaviour into a single readable number. You can analyse a business on its fundamentals and still use these signals to answer the questions fundamentals are slowest to answer: is the market turning against this stock, and is right now an unusually stretched moment to buy it?',
        },
        {
            heading: 'Moving Averages: The Trend, Smoothed',
            body: 'A moving average is just the average closing price over a window (most commonly 50 days or 200 days), recalculated daily so it glides behind the price. Its job is to filter noise into trend. When a stock trades above its rising 200-day average, the long-term trend is up; below a falling one, the path of least resistance is down. The 50-day tells the same story for the medium term. Neither predicts anything by itself: a moving average is a description of where the crowd has been, which matters because crowds in markets have momentum: trends persist more often than intuition suggests.',
        },
        {
            heading: 'Golden Crosses, Death Crosses, and What They Are Worth',
            body: 'The famous signals come from the two averages crossing. A "golden cross", when the 50-day rises above the 200-day, marks medium-term momentum turning up relative to the long-term trend, and historically has tended to precede decent average returns. The "death cross" is the mirror image and accompanied the major slides of 2008 and 2022. The honest caveat: these are lagging confirmations, not predictions, and they whipsaw in sideways markets, flashing buy and sell repeatedly while the stock goes nowhere. Treat a cross as a weather report saying conditions have changed, not as a forecast of what happens tomorrow.',
        },
        {
            heading: 'RSI: A Thermometer for Overreaction',
            body: 'The Relative Strength Index measures the speed of recent gains versus recent losses over (typically) 14 days, scaled from 0 to 100. Readings above 70 are conventionally "overbought", meaning the recent buying has been unusually one-sided, and below 30 "oversold." The crucial subtlety is that RSI measures stretch, not value. A great company\'s stock can read 75 simply because good news arrived; a dying company can sit at 25 the whole way to zero. In strong uptrends, RSI can stay overbought for months. Selling a winner just because RSI hit 70 has been one of the most expensive habits in bull markets. Its best use is the opposite case: a quality stock you already wanted, knocked to an oversold reading by a panic, is the setup where RSI genuinely earns its keep.',
        },
        {
            heading: 'How the Two Work Together',
            body: 'The combination is more useful than either alone, because they answer different questions: the moving average says which way the river flows, RSI says whether the current swimmer is exhausted. The classic disciplined setup is trading with the trend and entering on stretch: a stock above its rising 200-day average (healthy trend) that dips to a low RSI in a broad market scare (temporary stretch) offers a better-odds entry than chasing the same stock ten percent higher on an overbought reading. The reverse combination is the warning: a stock below a falling 200-day average where every RSI bounce fails is a market telling you, repeatedly, that something is wrong.',
        },
        {
            heading: 'The Right Size for These Tools',
            body: 'For a long-term investor, technicals should never overrule the fundamental case. A wonderful business does not become a bad one because of a death cross. Their proper jobs are narrower and genuinely valuable: timing entries into stocks you have already researched, staggering purchases when readings are stretched, and acting as an early smoke detector: persistent price weakness sometimes knows things before the quarterly report admits them, as holders closest to the company quietly leave. Use the fundamentals to decide what to own and roughly what it is worth. Let the technicals fine-tune when, and occasionally warn you to re-check why.',
        },
    ],
}
