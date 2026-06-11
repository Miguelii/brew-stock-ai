import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_MANY_STOCKS_DIVERSIFICATION_ARTICLE: EducationHubArticle = {
    slug: 'how-many-stocks-diversification',
    title: 'Diversification: How Many Stocks Do You Actually Need?',
    description:
        'The math says most of the benefit arrives by 20-30 stocks. The catch is that counting tickers is the wrong way to measure it — you can own 50 stocks and still hold one bet.',
    publishedAt: '2025-12-22',
    readingTimeMinutes: 5,
    theme: 'investing-strategy',
    sections: [
        {
            body: 'Diversification is the only widely agreed "free lunch" in investing — the one way to reduce risk without proportionally reducing expected return. But ask how much of it you need and you will hear everything from "ten good stocks" to "own the whole market." Both camps cite evidence, because they are answering different questions. The classic research answers one narrow question well; the more important question is the one investors usually forget to ask.',
        },
        {
            heading: 'What Diversification Can and Cannot Remove',
            body: "Stock risk comes in two layers. Company-specific risk — the fraud, the failed drug trial, the lost contract — is unique to each business, and because these accidents do not strike every company at once, owning more stocks dilutes them. Market risk is the layer beneath: recessions, rate shocks, panics that drag everything down together. No quantity of stocks removes it, because it is the risk of the asset class itself. Diversification's entire job is eliminating the first layer so that only the risk you are actually paid to bear — market risk — remains.",
        },
        {
            heading: 'The Curve That Flattens Fast',
            body: 'The classic studies, starting with Evans and Archer in 1968, measured portfolio volatility as you add randomly chosen stocks, and the result is a curve of sharply diminishing returns. Going from 1 stock to 10 removes a large share of company-specific volatility; by 20-30 stocks, most of what can be eliminated is gone; the fiftieth stock adds almost nothing the fortieth had not. This is the source of the standard "20-30 stocks is enough" advice, and as a statement about smoothing volatility, it holds up. But volatility is not the only thing an investor should worry about.',
        },
        {
            heading: 'The Catch: Missing the Winners',
            body: "Later research exposed the blind spot. Hendrik Bessembinder's study of nearly a century of US stocks found that the entire net wealth creation of the market above treasury bills came from roughly 4% of companies — a tiny minority of extreme winners carrying everything else. A 25-stock portfolio is statistically calm, but it can easily contain none of the next generation's big compounders, and missing them is a cost volatility charts never show. Concentrated portfolios do not just risk blowing up; they risk the quieter failure of simply not holding the handful of stocks that do all the work.",
        },
        {
            heading: 'Counting Tickers Is Not Diversification',
            body: 'The number also lies when the holdings rhyme. Fifty stocks that are all US large-cap technology is one bet wearing fifty costumes — 2022 made that painfully clear when the whole cluster fell together. Real diversification spreads exposure across sectors, geographies, and return drivers, so that the things that hurt one holding do not hurt them all simultaneously. Ten genuinely different businesses — a bank, an oil major, a retailer, a drugmaker — diversify better than thirty variations of the same theme. Correlation, not count, is the measure that matters.',
        },
        {
            heading: 'A Practical Answer',
            body: 'For the stock-picking part of a portfolio, somewhere between 15 and 30 genuinely different businesses captures most of the statistical benefit while staying few enough to actually follow — beyond that, most investors hold companies they have stopped researching, which is its own risk. Many sensible investors solve the winner-missing problem structurally: a broad index fund as the core guarantees you own whatever the next 4% turns out to be, with individual convictions concentrated around it. And remember that diversification is the defence against the unknown, not a substitute for judgment: it protects you from any single mistake, while ensuring no single brilliant call makes you rich. That trade-off is the price of the free lunch.',
        },
    ],
}
