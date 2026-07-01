import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const WHAT_IS_EBITDA_ARTICLE: EducationHubArticle = {
    slug: 'what-is-ebitda',
    title: 'EBITDA: What It Hides and Why Analysts Use It Anyway',
    description:
        'Warren Buffett mocks it, every analyst quotes it, and entire buyout industries are priced on it. Here is what EBITDA usefully measures — and the real costs it quietly deletes.',
    publishedAt: '2025-08-04',
    readingTimeMinutes: 5,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'Few numbers in finance provoke stronger opinions. Charlie Munger suggested that every time you hear "EBITDA" you should substitute the words "bullshit earnings"; meanwhile, nearly every analyst report, credit agreement, and acquisition is priced off it. Both camps are right about something. EBITDA is a genuinely useful comparison tool and a genuinely dangerous profit measure, and the trick is knowing which job it is doing in front of you.',
        },
        {
            heading: 'What the Acronym Strips Away',
            body: 'EBITDA is earnings before interest, taxes, depreciation, and amortisation. Start with operating profit and add back the four items. Interest depends on how the company chose to finance itself; taxes depend on jurisdiction; depreciation and amortisation are non-cash charges that spread the cost of past investments over time. Strip all four and you get a rough proxy for the cash-generating power of the core operations — before financing decisions, tax strategies, and accounting allocations enter the picture.',
        },
        {
            heading: 'Why Analysts Reach for It',
            body: 'The stripping is the point. Two identical factories — one bought with debt in a high-tax country, one with cash in a low-tax one — can report very different net incomes while being operationally identical. EBITDA makes them comparable. This is why EV/EBITDA became the standard valuation yardstick for comparing companies with different capital structures, and why lenders write debt covenants as multiples of EBITDA: it approximates the cash available to service obligations before the obligations themselves are counted. For comparing operating engines across companies and borders, it is honestly hard to beat.',
        },
        {
            heading: 'The Costs It Pretends Are Optional',
            body: 'The danger is treating EBITDA as profit. Depreciation is non-cash this year, but it represents something brutally real: machines wear out, vehicles age, data centres become obsolete, and replacing them consumes actual cash. For asset-heavy businesses — airlines, telecoms, manufacturers — depreciation approximates a recurring bill that absolutely must be paid for the company to keep operating. A capital-intensive business can post a handsome EBITDA and burn cash every single year once real capital expenditure is counted. Interest and taxes are not optional either; no shareholder ever got paid "before interest and taxes."',
        },
        {
            heading: 'Adjusted EBITDA: Where Creativity Lives',
            body: 'It gets worse before it gets better. Many companies report "adjusted EBITDA," adding back further items they deem one-off: restructuring charges, stock-based compensation, litigation costs. Sometimes the adjustments are fair. Often they are a parade of supposedly exceptional costs that somehow recur every year. WeWork\'s infamous "community-adjusted EBITDA" — which excluded marketing and administrative costs on the way to claiming profitability — remains the cautionary tale. The rule of thumb: the longer the list of adjustments, the harder you should look at what is being excluded and whether it truly never comes back.',
        },
        {
            heading: 'Using It Without Being Used by It',
            body: 'Treat EBITDA as a comparison tool, never a conclusion. Use EV/EBITDA to rank similar businesses, then immediately cross-check against free cash flow — operating cash flow minus capital expenditure — which counts the bills EBITDA ignores. If EBITDA is large but free cash flow is persistently thin or negative, the gap is usually capex, and the business is more expensive to run than the headline suggests. And for asset-light companies like software, where depreciation is genuinely small, EBITDA and cash flow converge — which is exactly why the metric flatters some industries and misleads in others. Know which kind of business you are looking at before trusting the number.',
        },
    ],
}
