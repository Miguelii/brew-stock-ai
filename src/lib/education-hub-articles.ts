// oxlint-disable max-lines
import type { ArticleTheme, EducationHubArticle } from '@/types/EducationHubArticle'

export const EDUCATION_HUB_ARTICLES: EducationHubArticle[] = [
    {
        slug: 'how-to-read-a-stock-analysis-report',
        title: 'How to Read a Stock Analysis Report (Without Drowning in Numbers)',
        description:
            'Most investors read a research report back to front and miss the point. Here is the order a professional reads it in, and the three numbers that decide everything.',
        publishedAt: '2025-04-01',
        readingTimeMinutes: 6,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'A good analyst does not read a research report top to bottom. They read it in a specific order, looking for the places where the story and the numbers disagree. That gap — between what the narrative claims and what the financials prove — is where the real insight lives. Once you know which sections answer which question, a 20-page report takes ten minutes to read and you walk away knowing whether the thesis holds.',
            },
            {
                heading: 'Start With the Thesis, Then Try to Break It',
                body: 'Every report opens with an investment thesis: a recommendation (buy, hold, sell), a price target, and two or three reasons. Read it — then immediately treat it as a claim to be disproved, not a conclusion to accept. If the thesis is "margins will expand as the company scales," your job for the rest of the report is to find the evidence for or against that one sentence. A price target without a clear, testable mechanism behind it is a guess dressed as analysis.',
            },
            {
                heading: 'The Three Numbers That Decide Most Cases',
                body: 'For the vast majority of companies, three figures tell you most of what you need. First, revenue growth — is the business actually getting bigger? Second, free cash flow — does it turn sales into real cash, or just accounting profit? Third, net debt relative to earnings — how much room does it have if a bad year arrives? A company growing revenue 15% a year, generating positive free cash flow, with net debt under two times EBITDA is in a fundamentally different position than one growing 3%, burning cash, and carrying five times leverage. Find those three numbers before you read a single paragraph of commentary.',
            },
            {
                heading: 'Valuation: Is the Good News Already Priced In?',
                body: 'Valuation answers one question: how much of the optimism is already in the price? A stock can be an excellent business and a poor investment if you overpay. The fastest read is the P/E ratio against the company\'s own history and its sector — if you are unsure how to interpret it, that is covered in detail in our P/E ratio guide. The key mental move is separating "is this a good company?" from "is this a good price?" They are different questions, and a report that only answers the first one is doing half the job.',
            },
            {
                heading: "Competitive Positioning: Why Won't This Disappear?",
                body: "Earnings tell you what happened last year. The competitive position tells you whether it can happen again. Look for what protects the profits: a brand customers pay up for, a network that grows more valuable with each user, switching costs that make leaving painful. Apple's ecosystem makes changing phones a chore; Visa's network is worth more to each merchant precisely because every other merchant is already on it. A business with no such protection can see strong margins competed away within a few years — which is why this section deserves as much attention as the financial statements.",
            },
            {
                heading: 'Read the Risk Section Like a Skeptic',
                body: "The risk section is where reports are most often skimmed and most often wrong to skim. Sort the risks into three buckets: company-specific (a failed product, a key customer lost), sector-specific (regulation, commodity prices), and macro (rates, recession). Then ask the only question that matters: which of these could permanently impair the business, versus which merely dents a quarter? A temporary margin squeeze is noise. A regulatory change that removes the company's core advantage is existential. The skill is not listing risks — the report already does that — it is judging which ones can actually break the thesis.",
            },
        ],
    },
    {
        slug: 'what-is-pe-ratio',
        title: 'What Is the P/E Ratio and Why Does It Matter?',
        description:
            "The Price-to-Earnings ratio is the most cited number in investing — and one of the most misunderstood. Here's what it measures, how to read it, and exactly when it lies.",
        publishedAt: '2025-04-05',
        readingTimeMinutes: 5,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'Open any financial news site and you will see stocks described as trading at "20x earnings" or "50x forward earnings." The P/E ratio is the single most quoted number in markets — and also the one most often used without thinking. Understanding what it actually says, and what it conveniently leaves out, separates investors who use it well from those it quietly misleads.',
            },
            {
                heading: 'The Basic Calculation',
                body: "The P/E ratio is a stock's price divided by its earnings per share. A stock at $100 earning $5 per share trades at a P/E of 20 — you are paying $20 for every $1 of annual profit. You will see two versions: trailing P/E (the last 12 months of actual earnings) and forward P/E (analyst estimates for the next 12). Forward P/E usually matters more for growing companies, because it reflects where the business is going rather than where it has been — but it is only as reliable as the estimates behind it, and estimates are frequently wrong.",
            },
            {
                heading: 'Why the Same P/E Means Opposite Things',
                body: 'Here is the part most explanations skip. In late 2023, Coca-Cola traded around 23x earnings and Nvidia traded above 60x. The market was not calling Nvidia six times "better" — it was pricing in explosive growth. Coca-Cola sells roughly the same amount of soda each year, so investors pay a modest multiple for stability. Nvidia\'s earnings were doubling, so a high multiple today can look cheap in hindsight if the growth arrives. A P/E is not a verdict on quality; it is a bet on the future packed into a single number. A low P/E on a declining business is a value trap, not a bargain.',
            },
            {
                heading: 'Comparing P/E Ratios Correctly',
                body: "A P/E in isolation is almost meaningless. It only becomes useful through three comparisons: against the company's own history (is it more or less expensive than it usually is?), against its sector (premium or discount to peers?), and against the broader market. A software company at 30x looks expensive until you notice its sector trades at 40x — at which point it is relatively cheap. Always anchor the number to something.",
            },
            {
                heading: 'When the P/E Ratio Lies to You',
                body: 'The P/E breaks in predictable ways. It is useless for companies with negative earnings — start-ups, turnarounds, cyclical troughs — because you cannot divide by a loss. It is distorted by one-off accounting items that inflate or deflate reported earnings for a single period. And it ignores debt entirely: two companies at the same P/E can carry wildly different risk if one is debt-free and the other is leveraged to the hilt. For a fuller picture, pair it with EV/EBITDA (which accounts for debt) and the PEG ratio (which adjusts for growth). The P/E is a starting point, never the finish line.',
            },
        ],
    },
    {
        slug: 'understanding-competitive-moats',
        title: "Competitive Moats: What Actually Protects a Company's Profits",
        description:
            'A moat is the difference between a company that earns 25% on capital for a decade and one that gets competed down to nothing. Learn the five types, how to spot them in the numbers, and how they erode.',
        publishedAt: '2025-04-10',
        readingTimeMinutes: 6,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'In capitalism, high profits are supposed to attract competition until those profits disappear. A "moat" is whatever stops that from happening — the structural reason a company can keep earning unusually high returns while rivals try and fail to take them away. It is the single most important question in long-term investing, because without a moat, even a great year is just a head start that competitors will eventually erase.',
            },
            {
                heading: 'The Five Types of Moat',
                body: "Almost every durable advantage falls into one of five buckets. Cost advantages let a company produce more cheaply than anyone else — Amazon's scale, Walmart's logistics. Network effects make a product more valuable as more people use it — Visa is worth more to each merchant precisely because every other merchant already accepts it. Switching costs create friction that keeps customers locked in — ripping out enterprise software like SAP can take years and millions. Intangible assets cover patents, brands, and licences — a pharma company's patent is a legal monopoly, and Apple's brand lets it charge a premium for similar hardware. And efficient scale applies where a market is only big enough to support one or two profitable players, making new entry irrational.",
            },
            {
                heading: 'How to See a Moat in the Numbers',
                body: 'The clearest fingerprint of a moat is a high return on invested capital (ROIC) sustained over many years. If a business earns 25–30% on the capital it deploys while rivals earn 8–10%, something is structurally protecting it. Visa, for example, has run ROIC well above 20% for over a decade — that persistence is the moat made visible. Two other tells: pricing power (can it raise prices without losing customers?) and market share that holds or grows even as competitors spend heavily to attack it. A single great year proves nothing; a decade of high returns proves a moat.',
            },
            {
                heading: 'Moat Erosion: What to Watch For',
                body: 'No moat is permanent. Technology dissolves cost advantages, patents expire, and tastes shift. The warning signs show up before the collapse: gross margins drifting down, customer churn ticking up, price competition intensifying, new entrants taking share. Kodak dominated film for decades and owned early digital patents — then watched the entire market move past it. Nokia led mobile phones until the smartphone made its advantage irrelevant almost overnight. Monitoring a moat is not a one-time check; it is an ongoing question every earnings season.',
            },
            {
                heading: 'Why the Moat Outranks the Quarter',
                body: 'A company can post a great quarter on a crumbling moat, or a weak quarter on an unbreakable one. For a long-term investor, the moat wins the argument every time, because it determines whether the business can recover from setbacks and keep compounding. A wide moat buys time — time to absorb a bad year, reinvest, and come back. That is why serious analysts spend as much energy on competitive positioning as on the financial statements: the statements describe the past, the moat underwrites the future.',
            },
        ],
    },
    {
        slug: 'how-to-assess-stock-risk',
        title: 'How to Assess Stock Risk Before You Invest',
        description:
            'The goal is not to avoid risk — it is to get paid enough for taking it. Here is how professionals separate the risks that dent a quarter from the ones that destroy a thesis.',
        publishedAt: '2025-04-15',
        readingTimeMinutes: 5,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'Picture a stock that could fall 40% in a recession but could also triple over five years. Is it risky? The honest answer is: it depends entirely on the price you pay and the odds you assign. Risk is not a thing to flee — it is a thing to price. The investors who do well are not the ones who avoid risk; they are the ones who refuse to take it unless the potential reward clearly justifies it.',
            },
            {
                heading: 'The Four Risks That Actually Move Stocks',
                body: 'Almost every threat to a stock fits one of four categories. Market risk hits everything at once — a recession or a rate shock drags good and bad companies down together, which is why diversification, not analysis, is the defence. Business risk is company-specific: a failed product, a lost key customer, a bad acquisition. Financial risk comes from the balance sheet — debt amplifies both gains and losses. And regulatory or macro risk lands on whole sectors at once: drug-pricing reform for pharma, antitrust for big tech, carbon rules for energy. Naming which bucket a risk lives in tells you whether you can diversify it away or must underwrite it directly.',
            },
            {
                heading: 'Financial Risk: Read the Debt Before the Story',
                body: 'Of the four, financial risk is the most quantifiable and the most underrated. Debt does not just add risk — it multiplies it. Compare two companies each earning $1 billion: one debt-free, one carrying $4 billion in debt. A 20% drop in earnings is a rough year for the first and a potential solvency crisis for the second. Three numbers tell the story: net debt to EBITDA (under 2x is comfortable, over 4x is fragile), interest coverage (can operating profit cover interest several times over?), and the maturity schedule (when must the debt be refinanced, and at what rate?). A highly leveraged company is a bet on everything going right.',
            },
            {
                heading: 'Are You Actually Being Compensated?',
                body: 'This is the question that turns risk assessment into investing. Suppose your honest estimate is a 30% chance the stock falls 50% and a 70% chance it doubles. The probability-weighted outcome is positive — you are being paid to take the risk. Flip it to a 70% chance of a 50% loss and a 30% chance of a double, and the same volatility is now a bad bet. The stock did not change; the odds and the price did. This is why two investors can look at the identical risk and one is right to buy while the other is right to pass — the difference is the price they are being asked to pay for the same uncertainty.',
            },
            {
                heading: "Volatility and Beta: Useful, but Don't Confuse Them With Risk",
                body: 'Beta measures how much a stock moves relative to the market: a beta of 1.5 means it tends to rise 15% when the market rises 10%, and fall just as hard. Volatility measures the size of those swings. Both are handy for sizing positions and understanding short-term pain — but neither tells you whether the underlying business can be permanently impaired. A stock can be highly volatile and low-risk (a sound company the market keeps repricing on noise) or calm and high-risk (a quietly deteriorating business not yet found out). Price movement is not the same as the danger of permanent loss.',
            },
        ],
    },
    {
        slug: 'what-is-earnings-per-share',
        title: 'Earnings Per Share (EPS): What Moves Stocks on Report Day',
        description:
            'Stocks can swing 15% in minutes on earnings day — and the trigger is rarely the EPS number itself. Here is what the figure measures, and what the market is really reacting to.',
        publishedAt: '2025-04-20',
        readingTimeMinutes: 5,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'On an earnings day, a stock can move 15% in the first minute of trading. Newcomers assume the company must have made or lost a fortune overnight. It did not. What moved is the gap between the earnings the company reported and the earnings the market had already priced in. EPS is the headline number — but the reaction is all about expectations, and understanding that gap is the difference between watching the chart in confusion and knowing why it moved.',
            },
            {
                heading: 'The Basic Calculation',
                body: 'Earnings per share is net income (total profit after taxes and expenses) divided by the number of shares outstanding. A company earning $1 billion with 500 million shares has an EPS of $2.00 — each share represents two dollars of profit. As with most metrics, it comes in trailing form (the last 12 months) and forward form (analyst estimates for the next 12). The number itself is simple; the interesting part is everything around it.',
            },
            {
                heading: 'Beats, Misses, and Why the Stock Already Knew',
                body: 'The market does not react to the EPS number — it reacts to EPS versus expectations. When Meta reported fourth-quarter 2023 earnings in February 2024, results crushed estimates and the stock jumped roughly 20% the next day, adding nearly $200 billion in market value in a single session. Had it merely met expectations, the move would have been muted, because "good" was already in the price. The lesson: a company can grow earnings 30% and still fall if the market expected 40%. You are not trading the result; you are trading the surprise.',
            },
            {
                heading: 'GAAP vs. Adjusted: Mind the Gap',
                body: 'Most companies report two EPS figures: GAAP (standard accounting rules) and adjusted (excluding items management deems non-recurring). Adjusted EPS strips out things like restructuring charges and stock-based compensation, which can give a cleaner view of the underlying business — or quietly hide real costs. The tell is consistency: a "one-off" charge that reappears every single year is not one-off, it is a recurring cost being relabelled. Always check what is being excluded and whether it genuinely belongs out of the picture.',
            },
            {
                heading: 'Where EPS Growth Actually Comes From',
                body: 'Consistent EPS growth is what investors ultimately pay for, but not all growth is equal. It comes from three sources, and they are not interchangeable. Revenue growth — selling more — is the healthiest. Margin expansion — keeping more of each dollar — is good but has limits. Share buybacks shrink the share count, which lifts EPS even if total profit is flat. A company "growing EPS 10%" purely by buying back stock while sales stagnate is a very different investment from one growing 10% because it is genuinely selling more. Always ask which engine is driving the number.',
            },
        ],
    },
    {
        slug: 'growth-vs-value-investing',
        title: 'Growth vs. Value Investing: Key Differences and When Each Wins',
        description:
            'These two philosophies are usually framed as enemies. The more useful question is which one the current interest-rate environment is quietly rewarding — and why.',
        publishedAt: '2025-04-25',
        readingTimeMinutes: 6,
        theme: 'investing-strategy',
        sections: [
            {
                body: 'Growth and value are the two great schools of stock picking, and they are almost always presented as a rivalry. In practice the rivalry is overblown — most strong investors borrow from both. What is genuinely useful is understanding the underlying logic of each, and recognising that the market environment, especially interest rates, can favour one for years at a time before the pendulum swings back.',
            },
            {
                heading: 'The Value Approach',
                body: 'Value investing, from Benjamin Graham through Warren Buffett, rests on a simple bet: markets sometimes misprice businesses, and buying below intrinsic value pays off as the gap closes. Value investors hunt low P/E and price-to-book ratios, healthy dividend yields, and strong free cash flow relative to market cap. They tend to buy what is unloved — companies facing temporary setbacks, stuck in unglamorous industries, or simply ignored. The risk they accept is that "cheap" can stay cheap, or turn out to be cheap for a very good reason.',
            },
            {
                heading: 'The Growth Approach',
                body: 'Growth investing targets companies expanding far faster than the economy and is willing to pay rich multiples for that expansion, betting future earnings will justify today\'s price. Amazon traded at seemingly absurd valuations for the better part of two decades — and rewarded the investors who understood that reported profit was being deliberately suppressed by reinvestment. The growth investor\'s real question is never "is this cheap today?" but "is the market underestimating how big this becomes?" Get that right and the entry multiple barely matters; get it wrong and you overpaid badly.',
            },
            {
                heading: 'The Value Premium — and the Decade It Vanished',
                body: 'Over the long sweep of market history, value has won. The research of Eugene Fama and Kenneth French documented a "value premium" of roughly 3–5% per year over many decades — cheap stocks beating expensive ones on average. But "on average" hides brutal stretches. Through most of the 2010s, growth crushed value, year after year, long enough that plenty of investors declared value investing dead. Then 2022 arrived and flipped the script in months. The premium is real over decades and entirely unreliable over any given year.',
            },
            {
                heading: 'Interest Rates: The Hidden Hand',
                body: "The single biggest driver of which style wins is the interest rate. A stock is worth the present value of its future earnings, and the discount rate you apply to those future earnings is anchored to rates. When rates are near zero, distant future profits are barely discounted — a gift to growth stocks whose value sits years out. When rates spiked in 2022, that distant value got marked down hard, and high-multiple growth names fell furthest while value's near-term earnings held up. You do not need to forecast rates perfectly, but knowing this mechanism explains most of the growth-versus-value seesaw — and stops you from mistaking a rate cycle for a permanent verdict.",
            },
            {
                heading: 'So Which Should You Own?',
                body: 'The honest answer is usually both, but for clear and different reasons — value for stability and income, growth for long-term capital appreciation — sized to your horizon and temperament. What matters more than the label is knowing exactly why you own each position and what would prove you wrong. An investor who can articulate the thesis behind every holding will outlast one who simply rotates into whichever style worked last year.',
            },
        ],
    },
    {
        slug: 'how-to-analyze-cash-flow',
        title: 'How to Analyse Cash Flow: Why It Matters More Than Profit',
        description:
            'Profit is an opinion; cash is a fact. Learn what free cash flow reveals that the income statement hides — and the famous cases where the two told opposite stories.',
        publishedAt: '2025-05-01',
        readingTimeMinutes: 6,
        theme: 'stock-analysis',
        sections: [
            {
                body: '"Revenue is vanity, profit is sanity, cash flow is reality." The adage survives because it keeps being proven right: companies report healthy profits and run out of cash, and companies report losses while quietly generating mountains of it. Learning to read cash flow is the closest thing investing has to a lie detector for the income statement.',
            },
            {
                heading: 'The Three Cash Flow Statements',
                body: 'Every public company publishes three. Operating cash flow is the one that matters most: cash actually generated by the core business, collected revenue minus paid expenses, largely immune to accounting choices. Investing cash flow covers capital expenditure and acquisitions — what the company spends to maintain and grow. Financing cash flow tracks debt raised or repaid, dividends, and buybacks. Read them in that order, and operating cash flow first.',
            },
            {
                heading: 'Why Profit Can Be Misleading',
                body: 'Accounting profit uses accrual rules: revenue is booked when earned, not when the cash lands. A company that sells $10 million on credit in December records the revenue immediately, even if payment only arrives in March — or never. Non-cash charges like depreciation reduce reported profit without touching the bank balance. The result is that two companies can post identical net income while one is flush with cash and the other is quietly running on fumes. The income statement tells you a story; cash flow tells you whether it is true.',
            },
            {
                heading: 'When the Two Numbers Diverged — and It Mattered',
                body: 'The widening gap between reported profit and operating cash flow is one of the most reliable red flags in all of investing. Enron is the textbook case: it reported rising profits for years while its actual cash generation told a far bleaker story, masked by aggressive revenue recognition and off-balance-sheet vehicles. You do not need a fraud that extreme for the lesson to apply — any company whose net income keeps climbing while operating cash flow stalls or falls deserves hard questions about how those profits are being counted.',
            },
            {
                heading: 'Free Cash Flow: The Number That Is Hard to Fake',
                body: 'Free cash flow is operating cash flow minus capital expenditure — the cash left over after the business has paid to maintain and grow itself. It is what funds dividends, buybacks, debt reduction, and acquisitions, and it is far harder to manipulate than earnings. A useful gauge is free cash flow yield: FCF per share divided by the share price. A stock generating $5 of FCF per share at $100 has a 5% yield — a real cash return that does not depend on accounting assumptions. Mature, stable businesses with FCF yields above 5% are often attractive; fast growers frequently show low or negative yields because they are deliberately reinvesting every dollar.',
            },
            {
                heading: 'Red Flags to Watch',
                body: 'Three patterns deserve immediate suspicion. A persistent and widening gap between net income and operating cash flow can signal aggressive revenue recognition or mounting unpaid receivables. Capital expenditure rising fast without matching revenue growth suggests money being poured into projects that are not paying off. And a company sustaining its dividend by issuing debt — rather than from free cash flow — is funding generosity it cannot actually afford. Any one of these is a reason to dig deeper before the market does it for you.',
            },
        ],
    },
    {
        slug: 'what-is-market-cap',
        title: 'Market Cap vs. Enterprise Value: Why the Sticker Price Lies',
        description:
            'Two companies can have the same market cap and be worth completely different amounts. The number that actually tells you what a business costs is the one most beginners ignore.',
        publishedAt: '2025-05-05',
        readingTimeMinutes: 5,
        theme: 'stock-analysis',
        sections: [
            {
                body: 'Market cap is the first number anyone learns about a stock, and the one that quietly causes the most confused valuations. It looks like the price of the company — but it is only the price of the equity. Imagine buying a house listed at $400,000 that comes with a $300,000 mortgage you must assume. The sticker says $400,000; your actual cost is $700,000. Companies work exactly the same way, and the number that captures the full cost has a different name.',
            },
            {
                heading: 'What Market Cap Actually Measures',
                body: "Market cap is the share price multiplied by shares outstanding: 500 million shares at $200 each gives a $100 billion market cap. It is the market's live valuation of the equity, and it changes by the second. It is genuinely useful for one thing — sizing. Large caps (above ~$10 billion) are established, liquid, heavily covered. Mid caps ($2–10 billion) trade growth for stability. Small caps (below $2 billion) can multiply or implode, with thin analyst coverage creating both the risk and the opportunity. But sizing is all market cap reliably tells you. It does not tell you what the business costs.",
            },
            {
                heading: "Enterprise Value: What You'd Actually Pay to Own It",
                body: 'Enterprise value fixes the blind spot. The formula is market cap plus debt minus cash. If a company has a $10 billion market cap, $5 billion of debt, and $1 billion of cash, its enterprise value is $14 billion — because an acquirer who buys the equity also inherits the debt and gets the cash. EV is the true takeover price. This is why a debt-laden company with a "small" market cap can be far more expensive than it looks, and a cash-rich one with a large market cap can be cheaper than its sticker suggests. The cash and debt sitting behind the equity completely change the real price.',
            },
            {
                heading: 'Why This Changes How You Compare Stocks',
                body: 'Once you see EV, the popular valuation ratios make more sense. P/E uses only the equity, so it ignores the balance sheet entirely — two companies at an identical P/E of 15 can be priced completely differently once debt enters the picture. That is exactly why professionals lean on EV/EBITDA: by putting enterprise value over operating earnings, it compares businesses on equal footing regardless of how each one is financed. A company that looks cheap on P/E can look expensive on EV/EBITDA the moment its debt is counted — and that second number is usually the more honest one.',
            },
            {
                heading: 'When Market Cap Still Earns Its Keep',
                body: "Market cap is not useless — it just answers a narrower question than people assume. It determines index membership, and that has real consequences: when a company grows large enough to enter the S&P 500, index funds are forced to buy its shares, creating demand that has nothing to do with the underlying business. It is also a quick, honest read on liquidity and where a stock sits in the risk spectrum. Use market cap to understand a company's size and place in the market. Use enterprise value to understand what it actually costs.",
            },
        ],
    },
    {
        slug: 'compounding-start-early',
        title: 'The Math of Compounding: Why Starting at 25 Beats Starting at 35',
        description:
            'Two people invest the same amount each month. One starts ten years earlier and contributes less in total — yet ends up with nearly twice as much. Here is the math that makes it happen.',
        publishedAt: '2025-05-10',
        readingTimeMinutes: 6,
        theme: 'personal-finance',
        sections: [
            {
                body: 'Almost everyone knows they should "start early." Almost no one has seen what that phrase is actually worth in numbers — and the numbers are far more dramatic than the cliché suggests. The reason is that compounding is not a straight line. It is a curve that stays flat and boring for years, then bends upward so steeply that the final decade does more work than the first three combined. The earlier you begin, the more of that explosive late curve you get to keep.',
            },
            {
                heading: 'Two Investors, One Ten-Year Head Start',
                body: 'Take Anna and Ben, both aiming to retire at 65, both earning a 7% average annual return — a reasonable long-run assumption for a diversified stock portfolio after inflation. Anna invests $300 a month from age 25. Ben invests the same $300 a month but starts at 35. Anna contributes for 40 years, Ben for 30. Anna puts in $36,000 more than Ben over her lifetime — a meaningful but not enormous difference. The outcome is not proportionate to that gap, and that is the entire point.',
            },
            {
                heading: 'The Result That Surprises People',
                body: 'At 65, Anna has roughly $790,000. Ben has roughly $370,000. Anna ends with more than double the balance despite contributing only about $36,000 more out of pocket. That extra decade at the start did not add 25% or 50% — it more than doubled the result. The ten years Ben skipped were, counterintuitively, his most valuable years, because the money he would have invested then had the longest possible time to compound. He can never buy those years back, no matter how much he saves later.',
            },
            {
                heading: 'Why the Last Decade Does the Heavy Lifting',
                body: "Compounding is exponential, which means each year's growth is calculated on a larger base than the year before. In Anna's first decade, her returns are modest because the balance is small. But in her final decade, she is earning 7% on a balance of several hundred thousand dollars — and a single year of growth near the end can exceed everything she contributed in her twenties. This is why the curve looks almost flat at the start and then rockets upward. The money you invest young is not just an early contribution; it is the seed that captures the steepest part of the curve.",
            },
            {
                heading: 'What This Means If You Are Already Past 25',
                body: 'The lesson is not "if you did not start at 25, you missed it." The same math that punishes a late start rewards starting today over starting next year, because the best decade is always the earliest one you have left. The second-best time to begin is now, and the cost of waiting is highest precisely when you feel you have the most time. Even modest amounts, invested consistently and left alone, ride the same curve — what they need most is not size but time.',
            },
            {
                heading: 'The Two Things That Can Break It',
                body: 'Compounding has two natural enemies. The first is interruption: pulling money out resets the curve and forfeits the future growth that capital would have produced. The second is fees, which compound against you with the same ruthless math that returns compound for you — a topic worth understanding in its own right, since a seemingly small annual fee can quietly consume a large share of a lifetime of growth. Protect the time horizon and minimise the drag, and the math does the rest on its own.',
            },
        ],
    },
    {
        slug: 'etfs-vs-index-funds-vs-mutual-funds',
        title: "ETFs vs. Index Funds vs. Mutual Funds: What You're Actually Paying For",
        description:
            'These three are constantly confused, and the differences cost real money. A 1% annual fee sounds trivial — over 30 years it can quietly eat roughly a quarter of your returns.',
        publishedAt: '2025-05-14',
        readingTimeMinutes: 6,
        theme: 'personal-finance',
        sections: [
            {
                body: 'The terms ETF, index fund, and mutual fund get used almost interchangeably, which hides the fact that they answer two completely separate questions. One is about how a fund is built and traded. The other — the one that actually determines how much money reaches your account — is about how much you pay to be in it. Confusing the two is how investors end up paying active fees for what is effectively a passive product.',
            },
            {
                heading: 'Two Questions Hiding in One Word',
                body: 'The first question is structure: how does the fund trade? A mutual fund is bought and sold once a day at its closing price, directly with the fund company. An ETF trades on an exchange like a stock, all day, at a live price. That is the entire structural difference — plumbing, not philosophy. The second question is strategy: is the fund trying to beat the market (active) or simply match it (passive, or "index")? These two questions are independent, which is the source of all the confusion.',
            },
            {
                heading: 'Why "Index Fund" Isn\'t a Third Category',
                body: 'An index fund is just any fund — mutual or ETF — that follows a passive strategy: it buys everything in an index like the S&P 500 and holds it, making no attempt to pick winners. So an "index fund" can be structured as a mutual fund or as an ETF. The meaningful split is not ETF versus index fund; it is passive versus active. A passive S&P 500 fund and an active stock-picking fund can both be ETFs. What separates them — and what you pay for — is whether a manager is trying to beat the market on your behalf.',
            },
            {
                heading: "The Fee Difference Sounds Trivial — It Isn't",
                body: 'Passive index funds commonly charge expense ratios around 0.03% to 0.10% a year. Active mutual funds often charge 0.50% to 1.00% or more, to pay for the managers and research behind the stock picking. One percent a year sounds like a rounding error. It is not. The reason is that the fee compounds against you every single year, on a growing balance — the same exponential math that builds wealth, working in reverse.',
            },
            {
                heading: 'What 1% Actually Costs Over 30 Years',
                body: 'Suppose you invest a lump sum and the market returns 7% a year for 30 years. In a fund charging 0.05%, you keep almost all of that 7%. In a fund charging 1%, your effective return drops to about 6%. That single percentage point, compounded over 30 years, leaves you with roughly 25% less money at the end — not 1% less, 25% less. The fee did not just take 1% a year; it took 1% a year and then took the compounded growth that 1% would have generated for three decades. You paid a quarter of your potential wealth for active management that, on average, fails to beat the index it is measured against.',
            },
            {
                heading: 'How to Choose Without Overthinking It',
                body: 'For most long-term investors, the decision collapses to two things. First, strategy: unless you have strong conviction in a specific manager, a low-cost passive index fund is the default that quietly beats the majority of active funds over time. Second, structure: an ETF gives you intraday trading and, in many jurisdictions, some tax efficiency; a mutual fund is simpler for automatic recurring contributions. Pick the strategy first — it matters far more — then choose whichever structure fits how you actually invest. And whatever you choose, read the expense ratio before anything else, because over decades it is the cost you most control.',
            },
        ],
    },
    {
        slug: 'the-4-percent-rule-fire',
        title: 'The 4% Rule and the Real Math Behind Financial Independence',
        description:
            'How much do you actually need to never work again? A famous study turned that question into a single multiplier — and a single number that is more nuanced than the internet admits.',
        publishedAt: '2025-05-18',
        readingTimeMinutes: 6,
        theme: 'personal-finance',
        sections: [
            {
                body: 'The question at the heart of the financial independence movement sounds impossibly vague: how much money is "enough" to stop working? In 1998 a study out of Trinity University turned that vagueness into a startlingly simple rule of thumb — one that lets you convert your annual spending into a concrete savings target. It is not gospel, and it has real limitations, but understanding it changes how you think about money from "how much do I earn?" to "how much freedom have I bought?"',
            },
            {
                heading: 'The Rule in One Sentence',
                body: 'The 4% rule says that if you withdraw 4% of your portfolio in your first year of retirement, then adjust that dollar amount for inflation each year after, your money has historically lasted at least 30 years across the large majority of market scenarios. The Trinity Study tested this against decades of real US market history, including crashes and high-inflation periods. Four percent was the withdrawal rate that survived almost all of them — a conservative figure chosen precisely so that even retirees who started just before a market collapse would have been fine.',
            },
            {
                heading: 'The Number That Falls Out of It: 25x',
                body: 'Flip the 4% rule around and it gives you a target. If you can safely withdraw 4% a year, then the portfolio you need is simply your annual spending multiplied by 25 (because 1 divided by 0.04 equals 25). Spend $40,000 a year? Your number is $1 million. Spend $60,000? It is $1.5 million. This is the single most clarifying calculation in personal finance, because it reframes the goal. Financial independence is not an income you chase — it is a multiple of your spending you accumulate. And it means cutting your annual spending does double duty: it lowers the target and raises your savings rate at the same time.',
            },
            {
                heading: 'Sequence-of-Returns Risk: The Catch Nobody Mentions',
                body: 'The 4% rule has a genuine vulnerability, and it is not the average return — it is the order in which returns arrive. Two retirees can experience the exact same average return over 30 years and have wildly different outcomes, purely based on timing. If a severe crash hits in your first few years of retirement, you are selling assets at depressed prices to fund withdrawals, permanently shrinking the base that needs to recover. The same crash arriving in year 20, after two decades of growth, is barely a scratch. This is sequence-of-returns risk, and it is why a flat 4% is a starting point, not a guarantee.',
            },
            {
                heading: 'The Honest Caveats',
                body: 'The rule rests on assumptions worth stating plainly. It was built on US market history, which has been unusually strong; other countries and other eras look less generous. It assumes a 30-year horizon, which may be too short for someone retiring in their forties under aggressive "FIRE" timelines. And it does not account for taxes, healthcare shocks, or your own behaviour in a downturn. Many practitioners adjust — using 3.5% for very long retirements, or staying flexible by trimming spending in bad years. The 4% rule is best treated as a powerful first approximation, not a promise.',
            },
            {
                heading: 'Why the Framing Alone Is Worth It',
                body: 'Even if you never literally retire on 4%, the mental model is transformative. It converts the abstract dread of "saving for the future" into a specific, trackable number, and it reveals the hidden leverage in spending less: every $1,000 you cut from annual expenses lowers your target by $25,000. Financial independence stops being a vague aspiration and becomes a finish line you can actually see — and measure your progress toward, year by year.',
            },
        ],
    },
    {
        slug: 'dividend-yield-traps',
        title: 'Dividend Yield Traps: When a 9% Yield Is a Warning, Not a Gift',
        description:
            'A sky-high dividend yield looks like free money. More often it is the market telling you a cut is coming. Here is how to tell a bargain from a trap before the payout disappears.',
        publishedAt: '2025-05-22',
        readingTimeMinutes: 5,
        theme: 'dividends-income',
        sections: [
            {
                body: 'You screen for income stocks and one jumps out: a 9% dividend yield while everything around it pays 3%. It looks like the market is handing you three times the income for free. It almost never is. A yield that high is usually not a reward the market overlooked — it is a warning the market is broadcasting. Understanding why requires seeing what the yield is actually made of.',
            },
            {
                heading: 'The Yield Goes Up When the Price Goes Down',
                body: 'Dividend yield is the annual dividend per share divided by the share price. The crucial part is that the share price is the denominator — so when the price falls, the yield mechanically rises, even though the company has not increased its payout by a cent. A stock paying $2 a year at a $40 price yields 5%. If bad news drives the price down to $22, that same unchanged $2 dividend now yields over 9%. The yield did not climb because the company got more generous. It climbed because the stock got cheaper, and stocks usually get cheaper for a reason.',
            },
            {
                heading: 'The Number That Reveals the Trap: Payout Ratio',
                body: 'The single best check is the payout ratio: the percentage of earnings (or, better, free cash flow) being paid out as dividends. A company paying out 50% of earnings has a comfortable cushion. A company paying out 95% has almost none. And a company paying out more than 100% — distributing more than it earns — is funding its dividend by burning cash or borrowing, which is not sustainable. When you see a 9% yield, the payout ratio usually tells you whether the company can keep paying it or is about to be forced to cut.',
            },
            {
                heading: 'What a Dividend Cut Actually Does',
                body: 'A high-yield trap typically ends one way: the company cuts the dividend. And a cut is a double blow. First, the income you bought the stock for shrinks or vanishes. Second, the stock price usually falls hard on the announcement, because income investors sell en masse and the market reads the cut as confirmation of distress. So the investor who chased a 9% yield often ends up with a smaller dividend and a capital loss at the same time — the precise opposite of the safe income they thought they were buying.',
            },
            {
                heading: 'How to Separate a Bargain From a Trap',
                body: 'Not every high yield is a trap — sometimes the market genuinely overreacts, and a sound company is left paying a real, sustainable above-average yield. The way to tell them apart is to look past the headline number. Check the payout ratio against free cash flow, look at whether earnings are growing or shrinking, see if debt is rising to cover the dividend, and ask why the price fell in the first place. A durable business with a temporary stumble and a payout ratio under 60% can be a genuine opportunity. A declining business paying out everything it earns is a yield designed to disappear. The yield is the bait; the cash flow behind it is the truth.',
            },
        ],
    },
    {
        slug: 'lump-sum-vs-dollar-cost-averaging',
        title: 'Lump Sum vs. Dollar-Cost Averaging: What the Data Actually Says',
        description:
            'Got a windfall? Conventional wisdom says drip it in slowly to reduce risk. The historical data says the opposite wins about two-thirds of the time — but the smart choice is more subtle.',
        publishedAt: '2025-05-26',
        readingTimeMinutes: 5,
        theme: 'investing-strategy',
        sections: [
            {
                body: 'You inherit $60,000, or a bonus lands, or you finally have savings to invest. The instinct, drilled in by years of cautious advice, is to spread it out — invest a little each month to avoid the nightmare of putting it all in the day before a crash. It feels obviously safer. The historical data, however, says that the "obviously safer" approach usually leaves you poorer. This is one of the cleanest examples in investing of intuition pointing the wrong way.',
            },
            {
                heading: 'Defining the Two Strategies',
                body: "Lump-sum investing means putting the entire amount into the market at once, today. Dollar-cost averaging (DCA) means dividing it into equal chunks and investing them on a schedule — say, one-twelfth each month over a year — so your average purchase price smooths out the market's ups and downs. DCA is what most people do automatically through a monthly paycheck contribution, and that is genuinely sensible because the money arrives gradually. The interesting question is different: when you already have a lump sum in hand, should you deploy it now or feed it in slowly?",
            },
            {
                heading: 'What the Historical Numbers Show',
                body: 'Vanguard ran exactly this comparison across decades of market history in the US, UK, and Australia. The finding was consistent: investing a lump sum immediately beat dollar-cost averaging it over 12 months roughly two-thirds of the time, and on average produced a meaningfully higher ending balance. The reason is unglamorous but powerful — markets rise more often than they fall. Money sitting on the sidelines waiting to be drip-fed is, on average, missing out on the upward drift it would have captured by being invested from day one.',
            },
            {
                heading: 'Why Time in the Market Beats Timing It',
                body: "DCA implicitly bets that prices will be lower in the coming months, giving you cheaper entry points. Sometimes they are. But because the market trends upward over time, more often than not the prices over the next year are higher than today's — so spreading out your buying means systematically paying more, not less. Holding cash to invest later is a quiet bet against the market's long-run tendency to rise, and history shows that bet loses about two times out of three.",
            },
            {
                heading: 'When DCA Is the Smarter Choice Anyway',
                body: 'The data favours lump sum, but money is not only math. Dollar-cost averaging exists to manage a real risk the spreadsheet ignores: your own behaviour. If investing the full amount today would leave you panic-selling at the first 20% drop — locking in the loss the lump-sum approach was supposed to ride through — then a strategy you can actually stick with beats an optimal one you will abandon. DCA also genuinely reduces the worst-case regret of investing everything right before a crash. The honest takeaway: lump sum wins on average, but if the emotional cost of a bad-timing scenario would derail you, paying a small expected return for peace of mind and discipline is a perfectly rational trade.',
            },
        ],
    },
]

export const EDUCATION_HUB_ARTICLE_MAP = new Map(EDUCATION_HUB_ARTICLES.map((a) => [a.slug, a]))

export const EDUCATION_HUB_THEMES: { value: ArticleTheme; label: string }[] = [
    { value: 'stock-analysis', label: 'Stock Analysis' },
    { value: 'investing-strategy', label: 'Investing Strategy' },
    { value: 'personal-finance', label: 'Personal Finance' },
    { value: 'dividends-income', label: 'Dividends & Income' },
]

export const EDUCATION_HUB_THEME_LABELS: Record<ArticleTheme, string> = Object.fromEntries(
    EDUCATION_HUB_THEMES.map((t) => [t.value, t.label])
) as Record<ArticleTheme, string>
