import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const DCF_VALUATION_BASICS_ARTICLE: EducationHubArticle = {
    slug: 'dcf-valuation-basics',
    title: 'DCF Valuation, Demystified: How Analysts Estimate What a Stock Is Worth',
    description:
        'Behind every price target sits a discounted cash flow model. Understanding how one works, and where its numbers are most fragile, tells you exactly how seriously to take the target.',
    publishedAt: '2025-09-29',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 10,
    theme: 'stock-analysis',
    keyTakeaways: [
        "A business is worth the cash it will generate over its life, translated into today's money. That is the entire idea.",
        'Three inputs decide almost everything: growth, the discount rate, and the terminal value.',
        'In a typical model more than half the answer sits in the terminal value, which is the part nobody can see.',
        'Small changes to the discount rate move the output violently, which is why interest rates move stock prices.',
        'The best use of a DCF is backwards: ask what the current price already assumes, then judge whether that is plausible.',
    ],
    sections: [
        {
            body: "Every analyst price target you have ever seen traces back, directly or loosely, to the same idea: a business is worth the cash it will generate for its owners over its lifetime, translated into today's money. That is the discounted cash flow model, and it is simultaneously the most intellectually honest valuation method in finance and the easiest to abuse. You do not need to build one to benefit from understanding it; you need to know which of its inputs do the real work, because that is where every optimistic price target hides its optimism.",
        },
        {
            heading: 'The core idea: future money is worth less than present money',
            body: "A dollar arriving in ten years is worth less than a dollar today. Today's dollar can be invested, and the future one carries a decade of uncertainty about whether it arrives at all. Discounting makes that intuition precise.",
            table: {
                caption: 'What $100 arriving in the future is worth today',
                headers: ['Arrives in', 'At 6%', 'At 8%', 'At 12%'],
                rows: [
                    ['1 year', '$94', '$93', '$89'],
                    ['5 years', '$75', '$68', '$57'],
                    ['10 years', '$56', '$46', '$32'],
                    ['20 years', '$31', '$21', '$10'],
                ],
                footnote:
                    'Rounded. Notice how the columns diverge as the horizon lengthens: the discount rate barely matters next year and decides everything two decades out.',
            },
            afterBody:
                "A DCF applies this to a company: forecast the free cash flow it will produce each year, shrink each year's figure back to present value, and add them up. The total is the estimated intrinsic value of the business. Compare that to the market price and you have an opinion about whether the stock is cheap.",
        },
        {
            heading: 'The three inputs that do all the work',
            body: 'Every DCF rests on three forecasts, and they are not equally reliable.',
            table: {
                caption: 'Where the answer actually comes from',
                headers: ['Input', 'What it is', 'How fragile'],
                rows: [
                    [
                        'Cash flow growth',
                        'How fast free cash flow grows over the explicit forecast period, usually five to ten years.',
                        'Moderately fragile. The first two years are often reasonable; year eight is guesswork.',
                    ],
                    [
                        'Discount rate',
                        'The return investors demand for the risk, anchored to prevailing interest rates and adjusted for the specific business.',
                        'Very fragile. A two-point change can move the valuation by a quarter or more.',
                    ],
                    [
                        'Terminal value',
                        'An estimate of everything beyond the forecast horizon, usually assuming modest permanent growth.',
                        'Extremely fragile, and usually more than half the total answer.',
                    ],
                ],
            },
            afterBody:
                'That last row is the famous weakness. In a typical model, well over half of the total value sits in the terminal value, meaning most of the answer comes from the part of the future no one can see. The five years of carefully researched forecasts in the middle of the spreadsheet often matter less than a single assumption about perpetual growth.',
        },
        {
            heading: 'Why small tweaks move the answer violently',
            body: 'The discounting mathematics is exponential, so the output is extraordinarily sensitive to inputs that each look individually reasonable.',
            table: {
                caption: 'Estimated value per share, same company, two assumptions changed',
                headers: [
                    '',
                    'Terminal growth 2.0%',
                    'Terminal growth 2.5%',
                    'Terminal growth 3.0%',
                ],
                rows: [
                    ['Discount rate 8%', '$168', '$186', '$210'],
                    ['Discount rate 9%', '$140', '$152', '$168'],
                    ['Discount rate 10%', '$120', '$129', '$140'],
                ],
                footnote:
                    'Illustrative. Same company, same cash flow forecasts. The range across defensible assumptions is $120 to $210, and every cell in this table could be defended in a research note.',
            },
            afterBody:
                'This sensitivity is why interest rates matter so much to stock prices, especially for growth companies whose cash flows sit far in the future: when rates rise, discount rates follow, and distant cash flows are marked down hardest. It is also why a motivated analyst can justify almost any price target without stating a single unreasonable assumption.',
        },
        {
            heading: 'Garbage in, gospel out',
            body: 'The danger in a DCF is not the mathematics, it is the false authority of the output. A model produces a figure to two decimal places and the precision feels like knowledge, even when it rests on a guess about a decade from now.',
            callout: {
                title: 'The professional trick: run it backwards',
                body: 'Instead of asking "what is this worth?", ask "what would have to be true for today\'s price to make sense?" Solve for the growth rate the current price implies rather than assuming one. If the answer is fifteen years of 20% growth with expanding margins in a competitive industry, you can judge that claim directly against what you know about the business. Sometimes the implied story is plausible. Often it is heroic, and seeing it stated plainly is the entire benefit.',
            },
            afterBody:
                'This inversion also removes the temptation to reverse-engineer inputs until the model agrees with a conclusion you already held, which is what happens to most DCFs built by people with a position.',
        },
        {
            heading: 'Where a DCF is useful and where it is not',
            body: 'The method suits some businesses far better than others, and knowing which is most of using it well.',
            table: {
                caption: 'Fit by business type',
                headers: ['Business', 'DCF usefulness', 'Why'],
                rows: [
                    [
                        'Mature, stable, predictable cash flows',
                        'High',
                        'The forecasts are genuinely forecastable and the terminal value assumption is defensible.',
                    ],
                    [
                        'Cyclical business',
                        'Low unless normalised',
                        'The starting point depends entirely on where you are in the cycle. Use mid-cycle earnings instead.',
                    ],
                    [
                        'Early-stage or pre-profit company',
                        'Very low',
                        'Nearly all the value sits in the terminal value, so the model is an assumption wearing a spreadsheet.',
                    ],
                    [
                        'Banks and insurers',
                        'Not applicable',
                        'Free cash flow is not meaningful when debt is raw material. Use dividend discount or book-value methods.',
                    ],
                    [
                        'Businesses facing structural disruption',
                        'Low',
                        'A DCF assumes the future resembles a scaled version of the present, which is exactly what disruption breaks.',
                    ],
                ],
            },
        },
        {
            heading: 'What this means for reading price targets',
            body: 'Treat any price target as the output of assumptions, and ask for the assumptions before trusting the number.',
            list: {
                ordered: true,
                items: [
                    'Ask what discount rate and terminal growth rate were used. If a research note does not disclose them, the target is an opinion wearing a number.',
                    "Sanity-check with simpler arithmetic. A stock on a very high multiple needs years of exceptional growth just to justify today's price, never mind a higher one.",
                    'Prefer ranges to points. An honest valuation is "somewhere between $150 and $220 depending on margins", even though headlines prefer a single figure.',
                    'Notice when a target changes without the business changing. That is usually the discount rate moving, which is a statement about interest rates rather than about the company.',
                    'Check how much of the value sits beyond year five. The more there is, the less the model is telling you.',
                ],
            },
            afterBody:
                "A DCF is not a crystal ball, it is a thinking tool. Its real value is that it forces every vague story about a company's future to declare itself as numbers, and numbers, unlike stories, can be checked.",
        },
    ],
}
