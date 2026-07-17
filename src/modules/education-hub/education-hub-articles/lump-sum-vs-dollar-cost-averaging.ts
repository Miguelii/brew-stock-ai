import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const LUMP_SUM_VS_DOLLAR_COST_AVERAGING_ARTICLE: EducationHubArticle = {
    slug: 'lump-sum-vs-dollar-cost-averaging',
    title: 'Lump Sum vs. Dollar-Cost Averaging: What the Data Actually Says',
    description:
        'Got a windfall? Conventional wisdom says drip it in slowly to reduce risk. The historical data says the opposite wins about two-thirds of the time, but the smart choice is more subtle.',
    publishedAt: '2025-05-26',
    readingTimeMinutes: 5,
    theme: 'investing-strategy',
    sections: [
        {
            body: 'You inherit $60,000, or a bonus lands, or you finally have savings to invest. The instinct, drilled in by years of cautious advice, is to spread it out: invest a little each month to avoid the nightmare of putting it all in the day before a crash. It feels obviously safer. The historical data, however, says that the "obviously safer" approach usually leaves you poorer. This is one of the cleanest examples in investing of intuition pointing the wrong way.',
        },
        {
            heading: 'Defining the Two Strategies',
            body: "Lump-sum investing means putting the entire amount into the market at once, today. Dollar-cost averaging (DCA) means dividing it into equal chunks and investing them on a schedule, say one-twelfth each month over a year, so your average purchase price smooths out the market's ups and downs. DCA is what most people do automatically through a monthly paycheck contribution, and that is genuinely sensible because the money arrives gradually. The interesting question is different: when you already have a lump sum in hand, should you deploy it now or feed it in slowly?",
        },
        {
            heading: 'What the Historical Numbers Show',
            body: 'Vanguard ran exactly this comparison across decades of market history in the US, UK, and Australia. The finding was consistent: investing a lump sum immediately beat dollar-cost averaging it over 12 months roughly two-thirds of the time, and on average produced a meaningfully higher ending balance. The reason is unglamorous but powerful: markets rise more often than they fall. Money sitting on the sidelines waiting to be drip-fed is, on average, missing out on the upward drift it would have captured by being invested from day one.',
        },
        {
            heading: 'Why Time in the Market Beats Timing It',
            body: "DCA implicitly bets that prices will be lower in the coming months, giving you cheaper entry points. Sometimes they are. But because the market trends upward over time, more often than not the prices over the next year are higher than today's, so spreading out your buying means systematically paying more, not less. Holding cash to invest later is a quiet bet against the market's long-run tendency to rise, and history shows that bet loses about two times out of three.",
        },
        {
            heading: 'When DCA Is the Smarter Choice Anyway',
            body: 'The data favours lump sum, but money is not only math. Dollar-cost averaging exists to manage a real risk the spreadsheet ignores: your own behaviour. If investing the full amount today would leave you panic-selling at the first 20% drop (locking in the loss the lump-sum approach was supposed to ride through), then a strategy you can actually stick with beats an optimal one you will abandon. DCA also genuinely reduces the worst-case regret of investing everything right before a crash. The honest takeaway: lump sum wins on average, but if the emotional cost of a bad-timing scenario would derail you, paying a small expected return for peace of mind and discipline is a perfectly rational trade.',
        },
    ],
}
