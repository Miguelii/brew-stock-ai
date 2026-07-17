import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const DCF_VALUATION_BASICS_ARTICLE: EducationHubArticle = {
    slug: 'dcf-valuation-basics',
    title: 'DCF Valuation, Demystified: How Analysts Estimate What a Stock Is Worth',
    description:
        'Behind every price target sits a discounted cash flow model. Understanding how one works, and where its numbers are most fragile, tells you exactly how seriously to take the target.',
    publishedAt: '2025-09-29',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Every analyst price target you have ever seen ("$240 by year end") traces back, directly or loosely, to the same idea: a business is worth the cash it will generate for its owners over its lifetime, translated into today\'s money. That is the discounted cash flow model, and it is simultaneously the most intellectually honest valuation method in finance and the easiest to abuse. You do not need to build one to benefit from understanding it; you need to know which of its inputs do the real work, because that is where every optimistic price target hides its optimism.',
        },
        {
            heading: 'The Core Idea: Future Money Is Worth Less Than Present Money',
            body: 'A dollar arriving in ten years is worth less than a dollar today; today\'s dollar can be invested, and the future one carries a decade of uncertainty. "Discounting" makes this precise: at an 8% discount rate, $100 arriving next year is worth about $93 today, and $100 arriving in ten years is worth roughly $46. A DCF simply applies this to a company: forecast the free cash flow it will produce each year, shrink each year\'s figure back to present value, and add them up. The total is the estimated intrinsic value of the business. Compare it to the market price and you have an opinion about whether the stock is cheap.',
        },
        {
            heading: 'The Three Inputs That Do All the Work',
            body: 'Every DCF rests on three forecasts. First, cash flow growth: how fast free cash flow grows over the explicit forecast period, usually five to ten years. Second, the discount rate: the return investors demand for the risk, typically 8-12% for equities, higher for riskier businesses, and anchored to prevailing interest rates. Third, the terminal value: an estimate of everything beyond the forecast horizon, usually assuming the company settles into modest permanent growth. That third input is the famous weakness: in a typical model, well over half of the total value sits in the terminal value, meaning most of the "answer" comes from the part of the future no one can see.',
        },
        {
            heading: 'Why Small Tweaks Move the Answer Violently',
            body: 'The discounting math is exponential, so the output is extraordinarily sensitive to inputs. Value a stable business at an 8% discount rate, then redo it at 10%, and the estimated value can fall by a quarter or more. Same company, same cash flows, one assumption changed. Nudge the terminal growth rate from 2% to 3% and value jumps double digits. This sensitivity is why interest rates matter so much to stock prices, especially for growth companies whose cash flows sit far in the future: when rates rise, discount rates follow, and distant cash flows are marked down hardest. It is also why a motivated analyst can justify nearly any price target with inputs that each look individually reasonable.',
        },
        {
            heading: 'Garbage In, Gospel Out',
            body: 'The DCF\'s danger is not the math; it is the false authority of the output. A model produces "$247.50 per share" and the precision feels like knowledge, even when it was built on a guess about 2035. The professionals who use DCFs well invert the exercise: rather than asking "what is this worth?", they ask "what would have to be true for today\'s price to make sense?", a discipline known as reverse-engineering the DCF, popularised by the investor Michael Mauboussin. If the current price implies fifteen years of 20% growth with expanding margins, you can judge that claim directly. Sometimes the implied story is plausible; often it is heroic, and seeing it stated plainly is the entire benefit.',
        },
        {
            heading: 'What This Means for Reading Price Targets',
            body: 'Treat any price target as the output of assumptions, and ask for the assumptions before trusting the number. Sanity-check targets with simpler arithmetic: a stock at a P/E of 40 needs years of exceptional growth just to justify today\'s price, never mind a higher one. Respect ranges over points: an honest valuation is "somewhere between $150 and $220 depending on margins," even if headlines prefer a single number. And remember the purpose: a DCF is not a crystal ball but a thinking tool. It forces every vague story about a company\'s future to declare itself as numbers, and numbers, unlike stories, can be checked.',
        },
    ],
}
