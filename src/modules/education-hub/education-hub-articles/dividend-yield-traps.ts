import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const DIVIDEND_YIELD_TRAPS_ARTICLE: EducationHubArticle = {
    slug: 'dividend-yield-traps',
    title: 'Dividend Yield Traps: When a 9% Yield Is a Warning, Not a Gift',
    description:
        'A sky-high dividend yield looks like free money. More often it is the market telling you a cut is coming. Here is how to tell a bargain from a trap before the payout disappears.',
    publishedAt: '2025-05-22',
    readingTimeMinutes: 5,
    theme: 'dividends-income',
    sections: [
        {
            body: 'You screen for income stocks and one jumps out: a 9% dividend yield while everything around it pays 3%. It looks like the market is handing you three times the income for free. It almost never is. A yield that high is usually not a reward the market overlooked; it is a warning the market is broadcasting. Understanding why requires seeing what the yield is actually made of.',
        },
        {
            heading: 'The Yield Goes Up When the Price Goes Down',
            body: 'Dividend yield is the annual dividend per share divided by the share price. The crucial part is that the share price is the denominator, so when the price falls, the yield mechanically rises, even though the company has not increased its payout by a cent. A stock paying $2 a year at a $40 price yields 5%. If bad news drives the price down to $22, that same unchanged $2 dividend now yields over 9%. The yield did not climb because the company got more generous. It climbed because the stock got cheaper, and stocks usually get cheaper for a reason.',
        },
        {
            heading: 'The Number That Reveals the Trap: Payout Ratio',
            body: 'The single best check is the payout ratio: the percentage of earnings (or, better, free cash flow) being paid out as dividends. A company paying out 50% of earnings has a comfortable cushion. A company paying out 95% has almost none. And a company paying out more than 100% (distributing more than it earns) is funding its dividend by burning cash or borrowing, which is not sustainable. When you see a 9% yield, the payout ratio usually tells you whether the company can keep paying it or is about to be forced to cut.',
        },
        {
            heading: 'What a Dividend Cut Actually Does',
            body: 'A high-yield trap typically ends one way: the company cuts the dividend. And a cut is a double blow. First, the income you bought the stock for shrinks or vanishes. Second, the stock price usually falls hard on the announcement, because income investors sell en masse and the market reads the cut as confirmation of distress. So the investor who chased a 9% yield often ends up with a smaller dividend and a capital loss at the same time: the precise opposite of the safe income they thought they were buying.',
        },
        {
            heading: 'How to Separate a Bargain From a Trap',
            body: 'Not every high yield is a trap; sometimes the market genuinely overreacts, and a sound company is left paying a real, sustainable above-average yield. The way to tell them apart is to look past the headline number. Check the payout ratio against free cash flow, look at whether earnings are growing or shrinking, see if debt is rising to cover the dividend, and ask why the price fell in the first place. A durable business with a temporary stumble and a payout ratio under 60% can be a genuine opportunity. A declining business paying out everything it earns is a yield designed to disappear. The yield is the bait; the cash flow behind it is the truth.',
        },
    ],
}
