import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_EARNINGS_PER_SHARE_ARTICLE: EducationHubArticle = {
    slug: 'what-is-earnings-per-share',
    title: 'Earnings Per Share (EPS): What Moves Stocks on Report Day',
    description:
        'Stocks can swing 15% in minutes on earnings day, and the trigger is rarely the EPS number itself. Here is what the figure measures, and what the market is really reacting to.',
    publishedAt: '2025-04-20',
    updatedAt: '2026-07-23',
    readingTimeMinutes: 9,
    theme: 'stock-analysis',
    keyTakeaways: [
        'EPS is profit divided by share count. Both halves of that fraction can move it, which is why the number alone tells you little.',
        'Stocks react to the gap between reported EPS and expected EPS, not to the EPS figure itself.',
        'Guidance for the next quarter usually moves the price more than the quarter just reported.',
        'Adjusted EPS excludes items management calls one-off. A charge that appears every year is not one-off.',
        'EPS growth driven by buybacks is not the same as EPS growth driven by selling more.',
    ],
    sections: [
        {
            body: 'On an earnings day, a stock can move 15% in the first minute of trading. Newcomers assume the company must have made or lost a fortune overnight. It did not. What moved is the gap between the earnings the company reported and the earnings the market had already priced in. EPS is the headline number, but the reaction is all about expectations, and understanding that gap is the difference between watching the chart in confusion and knowing why it moved.',
        },
        {
            heading: 'The basic calculation',
            body: 'Earnings per share is net income, meaning total profit after taxes and every expense, divided by the number of shares outstanding. A company earning $1 billion with 500 million shares has an EPS of $2.00: each share represents two dollars of profit. Like most metrics it comes in a trailing form, using the last twelve months of reported results, and a forward form, using analyst estimates for the next twelve.',
            table: {
                caption: 'The two ways EPS can rise',
                headers: ['', 'Year 1', 'Year 2 (more profit)', 'Year 2 (fewer shares)'],
                rows: [
                    ['Net income', '$1.00bn', '$1.10bn', '$1.00bn'],
                    ['Shares outstanding', '500m', '500m', '455m'],
                    ['Earnings per share', '$2.00', '$2.20', '$2.20'],
                ],
                footnote:
                    'Illustrative. Both scenarios deliver 10% EPS growth. Only one of them involves the business actually earning more.',
            },
            afterBody:
                'That table is the whole reason EPS needs interpreting rather than reading. A headline of "EPS up 10%" is compatible with a company that grew, and with a company that shrank its share count while standing still. The first question on any earnings release is which of the two happened.',
        },
        {
            heading: 'Beats, misses, and why the stock already knew',
            body: 'The market does not react to the EPS number, it reacts to EPS against expectations. Before a company reports, analysts publish estimates, and those estimates get absorbed into the price over the preceding weeks. By the time results arrive, the expected outcome is already paid for. Only the surprise is left to trade.',
            list: {
                items: [
                    'A company can grow earnings 30% and fall sharply, because the market expected 40%.',
                    'A company can report a decline and rally, because the market feared something worse.',
                    'A company can beat on EPS and still fall, because guidance for next quarter was cut.',
                    'A company can miss on EPS and rally, because the miss came from investment that expands the business.',
                ],
            },
            afterBody:
                'None of these are irrational. Each one makes sense the moment you stop treating the reported number as the news and start treating the revision to future expectations as the news.',
        },
        {
            heading: 'Why guidance usually matters more than the quarter',
            body: 'A quarter that has already happened is one small slice of a company you might hold for decades. Guidance about the next quarter, by contrast, is information about every quarter after it, because the market extrapolates. This is why a company can beat expectations comfortably and still drop sharply: management said the next three months would be softer, and the market repriced not one quarter but the whole trajectory.',
            callout: {
                title: 'What to read first',
                body: 'Open the release and read the outlook section before the results table. If guidance was raised, the reported quarter rarely matters. If guidance was cut or withdrawn, no beat in the quarter just reported will save the stock. Then check whether management changed the reasoning behind the guidance, not just the number: a cut blamed on one customer is a different situation from a cut blamed on demand.',
            },
        },
        {
            heading: 'GAAP versus adjusted: mind the gap',
            body: 'Most companies report two EPS figures. GAAP EPS follows standard accounting rules. Adjusted EPS excludes items management considers non-recurring or non-operational. Adjustments are not automatically dishonest: a genuine one-time legal settlement really does obscure the underlying trend. But the practice is discretionary, and the discretion belongs to the people whose compensation often depends on the result.',
            table: {
                caption: 'Common adjustments and how much scepticism they deserve',
                headers: ['Excluded item', 'Reasonable?', 'What to check'],
                rows: [
                    [
                        'Restructuring charges',
                        'Sometimes',
                        'Whether restructuring appears in most years. Perpetual restructuring is just how the company operates.',
                    ],
                    [
                        'Share-based compensation',
                        'Rarely',
                        'It is a real cost paid in shares instead of cash, and it dilutes you directly. Treat exclusion as a red flag.',
                    ],
                    [
                        'Acquisition and integration costs',
                        'Sometimes',
                        'Whether the company acquires continuously. For a serial acquirer these are operating costs.',
                    ],
                    [
                        'Impairments and write-downs',
                        'Usually',
                        'They are non-cash and backward-looking, but frequent write-downs say something about capital allocation.',
                    ],
                    [
                        'Legal settlements',
                        'Usually',
                        'Unless litigation is a structural feature of the industry, in which case it is a recurring cost of doing business.',
                    ],
                ],
            },
            afterBody:
                'The single most useful tell is the size and direction of the gap over time. If adjusted EPS is consistently and increasingly higher than GAAP EPS, the difference is where the story is, and it deserves more attention than either number on its own.',
        },
        {
            heading: 'Where EPS growth actually comes from',
            body: 'Consistent EPS growth is what investors ultimately pay for, but not all growth is equal. It comes from three engines, and they are not interchangeable.',
            list: {
                ordered: true,
                items: [
                    'Revenue growth. The company sells more. This is the healthiest source because it can continue indefinitely and usually signals that customers want the product.',
                    'Margin expansion. The company keeps more of each dollar of sales. Good, and often a sign of scale or pricing power, but it has a ceiling: margins cannot exceed 100% and rarely approach it.',
                    'Share count reduction. Buybacks shrink the denominator, so EPS rises even when total profit does not. This is real value returned to shareholders, but it is finite and it does not make the business better.',
                ],
            },
            afterBody:
                'A company growing EPS 10% by selling more is a growth business. A company growing EPS 10% by buying back stock while revenue stalls is a mature business returning capital, which can be a perfectly good investment but should be valued as a very different thing. The two are indistinguishable from the headline figure alone, which is precisely why the headline figure alone is not enough.',
        },
        {
            heading: 'Diluted EPS, and why it is the one to use',
            body: 'Companies report basic EPS, using shares currently outstanding, and diluted EPS, which also counts shares that would exist if outstanding options, restricted stock, and convertible instruments were exercised. Diluted is the conservative figure and the one to work with, because those claims on future shares are real and management issued them deliberately.',
            afterBody:
                'The gap between basic and diluted EPS is a quiet measure of how much of the company is being paid out in equity. A widening gap means your ownership stake is shrinking each year even if you never sell a share, and no buyback programme is genuinely returning capital if it is only offsetting that dilution.',
        },
        {
            heading: 'A short checklist for earnings day',
            body: 'Most of the value in an earnings release is available within five minutes if you read it in the right order.',
            list: {
                ordered: true,
                items: [
                    'Read the guidance first. It usually decides the reaction.',
                    'Compare reported EPS to the consensus estimate, not to last year.',
                    'Check revenue alongside EPS. Profit growth without revenue growth needs an explanation.',
                    'Note the share count against the same quarter last year, to see how much of the EPS change came from buybacks or dilution.',
                    'Find the gap between GAAP and adjusted EPS, and read what was excluded.',
                    'Check whether cash flow moved in the same direction as reported profit. When they diverge, believe the cash.',
                ],
            },
            afterBody:
                'EPS is a headline, not a conclusion. It compresses profit, share count, accounting choices, and one-off events into a single figure, and the market prices the difference between that figure and what it already expected. Read what is underneath it and earnings day stops looking random.',
        },
    ],
}
