import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const HOW_TO_READ_A_STOCK_ANALYSIS_REPORT_ARTICLE: EducationHubArticle = {
    slug: 'how-to-read-a-stock-analysis-report',
    title: 'How to Read a Stock Analysis Report (Without Drowning in Numbers)',
    description:
        'Most investors read a research report back to front and miss the point. Here is the order a professional reads it in, and the three numbers that decide everything.',
    publishedAt: '2025-04-01',
    readingTimeMinutes: 6,
    theme: 'stock-analysis',
    sections: [
        {
            body: 'A good analyst does not read a research report top to bottom. They read it in a specific order, looking for the places where the story and the numbers disagree. That gap, between what the narrative claims and what the financials prove, is where the real insight lives. Once you know which sections answer which question, a 20-page report takes ten minutes to read and you walk away knowing whether the thesis holds.',
        },
        {
            heading: 'Start With the Thesis, Then Try to Break It',
            body: 'Every report opens with an investment thesis: a recommendation (buy, hold, sell), a price target, and two or three reasons. Read it, then immediately treat it as a claim to be disproved, not a conclusion to accept. If the thesis is "margins will expand as the company scales," your job for the rest of the report is to find the evidence for or against that one sentence. A price target without a clear, testable mechanism behind it is a guess dressed as analysis.',
        },
        {
            heading: 'The Three Numbers That Decide Most Cases',
            body: 'For the vast majority of companies, three figures tell you most of what you need. First, revenue growth: is the business actually getting bigger? Second, free cash flow: does it turn sales into real cash, or just accounting profit? Third, net debt relative to earnings: how much room does it have if a bad year arrives? A company growing revenue 15% a year, generating positive free cash flow, with net debt under two times EBITDA is in a fundamentally different position than one growing 3%, burning cash, and carrying five times leverage. Find those three numbers before you read a single paragraph of commentary.',
        },
        {
            heading: 'Valuation: Is the Good News Already Priced In?',
            body: 'Valuation answers one question: how much of the optimism is already in the price? A stock can be an excellent business and a poor investment if you overpay. The fastest read is the P/E ratio against the company\'s own history and its sector. If you are unsure how to interpret it, that is covered in detail in our P/E ratio guide. The key mental move is separating "is this a good company?" from "is this a good price?" They are different questions, and a report that only answers the first one is doing half the job.',
        },
        {
            heading: "Competitive Positioning: Why Won't This Disappear?",
            body: "Earnings tell you what happened last year. The competitive position tells you whether it can happen again. Look for what protects the profits: a brand customers pay up for, a network that grows more valuable with each user, switching costs that make leaving painful. Apple's ecosystem makes changing phones a chore; Visa's network is worth more to each merchant precisely because every other merchant is already on it. A business with no such protection can see strong margins competed away within a few years, which is why this section deserves as much attention as the financial statements.",
        },
        {
            heading: 'Read the Risk Section Like a Skeptic',
            body: "The risk section is where reports are most often skimmed and most often wrong to skim. Sort the risks into three buckets: company-specific (a failed product, a key customer lost), sector-specific (regulation, commodity prices), and macro (rates, recession). Then ask the only question that matters: which of these could permanently impair the business, versus which merely dents a quarter? A temporary margin squeeze is noise. A regulatory change that removes the company's core advantage is existential. The skill is not listing risks, since the report already does that; it is judging which ones can actually break the thesis.",
        },
    ],
}
