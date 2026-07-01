import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const STOCK_BUYBACKS_EXPLAINED_ARTICLE: EducationHubArticle = {
    slug: 'stock-buybacks-explained',
    title: 'Stock Buybacks: Return of Capital or Financial Engineering?',
    description:
        'Companies spend hundreds of billions a year buying their own shares. Whether that enriches you or quietly wastes your money depends on one variable almost nobody checks: the price paid.',
    publishedAt: '2025-09-01',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Share buybacks are either the most shareholder-friendly use of corporate cash or a scheme to inflate executive bonuses, depending on who is shouting. The polarised debate hides a boring truth: a buyback is neither good nor bad in itself. It is a capital allocation decision, exactly like building a factory or making an acquisition, and it should be judged the same way — by the return earned on the money spent. The return on a buyback is determined by one thing: the price paid for the shares.',
        },
        {
            heading: 'The Mechanics: A Shrinking Denominator',
            body: 'When a company repurchases its own shares, those shares are retired and the count of shares outstanding falls. The business is unchanged, but it is now divided into fewer pieces — so each remaining share represents a larger slice of the same profits. A company earning $10 billion across 5 billion shares has an EPS of $2.00; retire half a billion shares and EPS rises to about $2.22 with not a dollar of additional profit. Every remaining shareholder owns proportionally more of the company without buying anything. That is the entire mechanism.',
        },
        {
            heading: 'Why Companies Choose Buybacks Over Dividends',
            body: 'Both are ways of returning cash, but they behave differently. Dividends create an expectation — cutting one is read as distress, so boards commit to them carefully. Buybacks are flexible: they can be paused quietly in a hard year. In many tax systems they are also more efficient, since a dividend is taxed on arrival while a buyback raises the value of each share and lets investors choose when to realise the gain. Apple is the canonical case: well over half a trillion dollars of repurchases since 2012, shrinking its share count by more than a third — a major, deliberate driver of its per-share returns.',
        },
        {
            heading: 'The Variable Everyone Ignores: Price',
            body: 'Here is the test that separates value creation from destruction. A buyback is the company buying a stock — its own — so the logic of any stock purchase applies: buying below intrinsic value creates value for remaining shareholders, and overpaying destroys it. When a company repurchases shares at depressed prices, the remaining owners get a larger stake cheaply. When it buys at euphoric highs, it spends shareholder cash on an overpriced asset. The airlines that spent billions on buybacks through the 2010s, then needed government rescue in 2020, are the textbook example of repurchases made with cash the balance sheet could not spare, at prices that look painful in hindsight.',
        },
        {
            heading: 'The Less Flattering Motives',
            body: 'Buybacks have a second life as cosmetics. Because they mechanically lift EPS, they can dress up a stagnating business — a company "growing EPS 8%" through repurchases alone, with flat revenue and flat profit, is shrinking its way to the appearance of growth. They also conveniently offset the dilution from executive stock compensation: shares are issued to management, then bought back with company cash, and the share count looks stable while shareholder money quietly funds the pay packet. And when EPS targets in bonus plans can be hit by repurchasing shares rather than improving the business, the incentive problem writes itself.',
        },
        {
            heading: 'How to Judge One From the Outside',
            body: 'Four questions sort the worthwhile from the wasteful. Is the buyback funded by genuine free cash flow, or by debt? Is the company buying when its valuation is reasonable, or only at cycle peaks — check whether repurchases accelerated when the stock was cheap or when it was popular. Is the share count actually falling over the years, or merely offsetting stock-compensation dilution? And is the company starving better uses — research, necessary capex — to fund it? A debt-free company steadily retiring shares at sensible prices is returning capital with discipline. One borrowing to repurchase at all-time highs while issuing shares to executives is doing something else entirely, whatever the press release says.',
        },
    ],
}
