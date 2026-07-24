import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const MOVING_AVERAGES_AND_RSI_ARTICLE: EducationHubArticle = {
    slug: 'moving-averages-and-rsi',
    title: "Moving Averages and RSI: A Fundamental Investor's Guide to Technical Signals",
    description:
        'You do not have to become a chart trader to use technical signals. Two indicators, the moving average and RSI, can sharpen your entries and flag trouble the fundamentals have not reported yet.',
    publishedAt: '2025-10-27',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 10,
    theme: 'stock-analysis',
    keyTakeaways: [
        'Technical indicators describe crowd behaviour. They do not predict, and they do not know anything about the business.',
        'A moving average tells you which way the trend runs. RSI tells you whether the recent move is stretched.',
        'RSI measures stretch, not value. A great stock can stay overbought for months and a failing one can stay oversold to zero.',
        'Crossovers are lagging confirmations and they whipsaw badly in sideways markets.',
        'For a long-term investor these tools decide when, never what. The fundamentals decide what.',
    ],
    sections: [
        {
            body: 'Fundamental investors love to dismiss technical analysis as astrology with charts, and plenty of it deserves the scorn. But two of its tools have survived every fad cycle for a simple reason: they compress real information about supply, demand, and crowd behaviour into a single readable number. You can analyse a business on its fundamentals and still use these signals to answer the questions fundamentals are slowest to answer: is the market turning against this stock, and is right now an unusually stretched moment to buy it?',
        },
        {
            heading: 'Moving averages: the trend, smoothed',
            body: 'A moving average is the average closing price over a window, recalculated each day so it glides behind the price. Its job is to filter noise into trend. The window you choose decides what question you are asking.',
            table: {
                caption: 'Common windows and what they are used for',
                headers: ['Window', 'Horizon', 'Typical use'],
                rows: [
                    [
                        '20-day',
                        'Weeks',
                        'Short-term momentum. Noisy enough that long-term investors can usually ignore it.',
                    ],
                    [
                        '50-day',
                        'Months',
                        'Medium-term trend. Often acts as a reference level that traders watch, which makes it partly self-fulfilling.',
                    ],
                    [
                        '200-day',
                        'About a year',
                        'The long-term trend. The single most widely watched line in markets, and the one most relevant to an investor.',
                    ],
                ],
            },
            afterBody:
                'When a stock trades above a rising 200-day average, the long-term trend is up. Below a falling one, the path of least resistance is down. Neither predicts anything by itself: a moving average is a description of where the crowd has been. That matters only because trends in markets persist somewhat more often than intuition suggests, not because the line has any power of its own.',
        },
        {
            heading: 'Golden crosses, death crosses, and what they are worth',
            body: 'The famous signals come from two averages crossing. A golden cross, when the 50-day rises above the 200-day, marks medium-term momentum turning up relative to the long-term trend. The death cross is the mirror image, and it has accompanied most major market declines, which is exactly what you would expect from a signal defined by prices having already fallen.',
            callout: {
                title: 'Why crossovers disappoint',
                body: 'Both averages are calculated from past prices, so a cross can only confirm a move that already happened. In a trending market that confirmation is useful. In a sideways market the two lines cross back and forth repeatedly, generating a stream of buy and sell signals while the stock goes nowhere and each round trip costs you spread and tax. Treat a cross as a weather report saying conditions have changed, never as a forecast of tomorrow.',
            },
        },
        {
            heading: 'RSI: a thermometer for overreaction',
            body: 'The Relative Strength Index measures the size of recent gains against recent losses, conventionally over 14 days, scaled from 0 to 100. Readings above 70 are described as overbought, meaning recent buying has been unusually one-sided, and below 30 as oversold.',
            table: {
                caption: 'Reading RSI honestly',
                headers: ['Reading', 'Conventional label', 'What it actually means'],
                rows: [
                    [
                        'Above 70',
                        'Overbought',
                        'The recent move up has been fast and one-sided. It says nothing about whether the price is too high.',
                    ],
                    [
                        '30 to 70',
                        'Neutral',
                        'Nothing unusual is happening. This is where most stocks sit most of the time.',
                    ],
                    [
                        'Below 30',
                        'Oversold',
                        'The recent move down has been fast and one-sided. It says nothing about whether the price is now cheap.',
                    ],
                ],
                footnote:
                    'The labels are the source of most of the damage this indicator causes. "Overbought" sounds like "too expensive" and means nothing of the kind.',
            },
            afterBody:
                "The crucial subtlety is that RSI measures stretch, not value. A great company's stock can read 75 simply because genuinely good news arrived, and in a strong uptrend it can stay above 70 for months. A deteriorating company can sit below 30 the entire way down. Selling a winner because RSI hit 70 has been one of the most expensive habits available to investors.",
        },
        {
            heading: 'Where RSI genuinely earns its keep',
            body: 'The indicator is close to useless as a standalone signal and quite useful as a timing input on a decision you have already made on other grounds.',
            list: {
                items: [
                    'A company you have already researched and want to own, knocked to an oversold reading by a broad market panic rather than by company-specific news. This is the setup the indicator was built for.',
                    'Staggering an entry. If you intend to buy and the reading is stretched upward, splitting the purchase across several weeks costs little and removes the worst-case timing outcome.',
                    'Noticing divergence. When a stock makes a new high but RSI makes a lower high, the move up is being driven by fewer and weaker buyers. It is not a sell signal, it is a reason to re-read the thesis.',
                ],
            },
            afterBody:
                'What connects all three is that the fundamental decision came first. RSI adjusted the timing of an action already justified, which is the only role it plays reliably.',
        },
        {
            heading: 'How the two work together',
            body: 'The combination is more useful than either alone, because they answer different questions. The moving average says which way the river flows; RSI says whether the current swimmer is exhausted.',
            table: {
                caption: 'Four combinations',
                headers: ['Trend (vs 200-day)', 'RSI', 'What it suggests'],
                rows: [
                    [
                        'Above a rising average',
                        'Oversold',
                        'The best-odds entry available to a patient buyer: a healthy trend interrupted by a temporary scare.',
                    ],
                    [
                        'Above a rising average',
                        'Overbought',
                        'A working trend, stretched. Not a reason to sell a good business, but a poor moment to chase.',
                    ],
                    [
                        'Below a falling average',
                        'Oversold',
                        'The most dangerous combination. Repeatedly buying oversold readings in a downtrend is how people average into losses.',
                    ],
                    [
                        'Below a falling average',
                        'Overbought',
                        'A bounce inside a downtrend. Often where recoveries fail.',
                    ],
                ],
            },
            afterBody:
                'The bottom-left cell deserves emphasis. A stock below a falling long-term average where every RSI bounce fails is the market telling you, repeatedly, that something is wrong. Sometimes the market is wrong. But the correct response is to go back and re-examine the business, not to keep buying because the indicator says cheap.',
        },
        {
            heading: 'The right size for these tools',
            body: 'For a long-term investor, technicals should never overrule the fundamental case. A wonderful business does not become a bad one because two lines crossed, and a failing one does not become sound because a momentum reading recovered.',
            list: {
                ordered: true,
                items: [
                    'Use the fundamentals to decide what to own and roughly what it is worth. That decision is made before any chart is opened.',
                    'Use the trend to avoid buying into something the market has been abandoning for a year, and to make yourself explain why the market is wrong before you do it anyway.',
                    'Use RSI to fine-tune entry timing and to stagger purchases, not to trigger them.',
                    'Treat persistent price weakness as a smoke detector. It is occasionally right before the quarterly report admits anything, because holders closest to the company sometimes leave quietly.',
                    'Never let a technical signal decide a sale on its own. If the reason to sell is not something about the business or the price relative to value, it is probably not a reason.',
                ],
            },
            afterBody:
                'Used this way the two indicators are modest, honest tools: they describe what the crowd is doing, which is worth knowing precisely because you are trading against that crowd. Used as a decision system, they are a way of paying attention to everything except the company you are buying.',
        },
    ],
}
