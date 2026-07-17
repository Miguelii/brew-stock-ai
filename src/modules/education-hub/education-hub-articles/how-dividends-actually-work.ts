import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_DIVIDENDS_ACTUALLY_WORK_ARTICLE: EducationHubArticle = {
    slug: 'how-dividends-actually-work',
    title: 'How Dividends Actually Work: Ex-Dates, Payouts, and Reinvestment',
    description:
        'Buying a stock the day before its dividend does not get you free money; the price adjusts to the cent. Here is the full mechanics of dividends, from declaration to reinvestment.',
    publishedAt: '2026-05-11',
    readingTimeMinutes: 5,
    theme: 'dividends-income',
    sections: [
        {
            body: 'Every new income investor eventually has the same idea: buy the stock just before the dividend is paid, collect the payment, sell. It feels like a loophole, and it fails every time. On the morning the stock trades "ex-dividend," its price opens lower by almost exactly the dividend amount. Nothing was free, because a dividend is not a bonus; it is a transfer of money you already owned, moved from the company\'s bank account to yours. Understanding that single fact, and the calendar around it, is most of what there is to know about dividend mechanics.',
        },
        {
            heading: 'The Four Dates That Govern Every Dividend',
            body: 'A dividend travels through four dates. The declaration date is when the board announces it, with the amount and schedule. The ex-dividend date is the one that matters for ownership: buy the stock on or after this date and the upcoming payment is not yours; the seller keeps it. The record date, a day or so later, is the administrative snapshot of who holds the shares. The payment date is when cash lands in accounts, often weeks after. The only date requiring attention is the ex-date, and the price adjustment on that morning is exactly why timing purchases around it earns nothing.',
        },
        {
            heading: 'Why the Price Drops on the Ex-Date',
            body: 'The mechanics are bookkeeping, not market mood. A company about to pay €1 per share holds that euro per share in cash; the moment the stock trades ex-dividend, a buyer no longer receives it, so the share is worth €1 less, and exchanges adjust quotes accordingly at the open. A €50 stock paying a €1 dividend becomes, all else equal, a €49 stock plus €1 of cash on its way to the previous owner. Total wealth is unchanged. This is also why a dividend is not "income" in the way rent is: it is a partial liquidation of your position, voluntary on the company\'s side, taxable on yours.',
        },
        {
            heading: 'Yield, Payout Ratio, and Reading the Pair',
            body: 'Two numbers describe any dividend. The yield (annual dividend divided by share price) is the headline figure, currently around 1-2% for broad indexes and 3-6% for classic income sectors like utilities and telecoms. The payout ratio (dividends as a share of earnings or free cash flow) is the durability figure: around 40-60% leaves room to invest and absorb bad years, while ratios drifting above 80-90% leave none. The pair should be read together, because a fat yield over a stretched payout ratio is the classic warning sign, a pattern dissected in our guide to dividend yield traps. The yield tells you what is promised; the payout ratio tells you whether to believe it.',
        },
        {
            heading: 'Reinvestment: Where Dividends Earn Their Reputation',
            body: "The celebrated long-run power of dividends comes almost entirely from reinvesting them. Each payment used to buy more shares makes the next payment slightly larger, which buys more shares again: compounding running on autopilot. The difference this makes over decades is enormous: across long market histories, reinvested dividends account for a large fraction of total equity returns, turning an index's price growth into a multiple of itself. Most brokers automate this through dividend reinvestment plans (DRIPs), which buy fractional shares on payment day with no decision required. An income investor spending the dividends owns an income stream; a reinvesting investor owns a compounding machine.",
        },
        {
            heading: 'The Decisions That Actually Matter',
            body: "Dividend mechanics settled, the real choices are simple. Reinvest automatically during accumulation years and switch to collecting cash only when you genuinely need the income. Mind the taxes: in most jurisdictions dividends are taxed in the year received, reinvested or not, which makes tax-sheltered accounts the natural home for high-yield holdings. And never select stocks on yield alone. A company's ability to grow its payout, covered next in our dividend growth guide, matters far more than the size of today's cheque. The calendar games, meanwhile, can be permanently ignored: the ex-date arithmetic guarantees there is nothing to win.",
        },
    ],
}
