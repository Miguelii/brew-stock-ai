import type { EducationHubArticle } from '@/types/EducationHubArticle'

export const EDUCATION_HUB_ARTICLES: EducationHubArticle[] = [
    {
        slug: 'how-to-read-a-stock-analysis-report',
        title: 'How to Read a Stock Analysis Report',
        description:
            'A step-by-step guide to understanding the key sections of a professional stock analysis report — from valuation metrics to risk factors.',
        publishedAt: '2025-04-01',
        readingTimeMinutes: 6,
        sections: [
            {
                body: 'Professional stock analysis reports can feel overwhelming at first. They are packed with financial ratios, sector comparisons, and forward-looking estimates. But once you know what each section is trying to answer, reading them becomes second nature. This guide breaks down the anatomy of a stock analysis report so you can extract the insights that matter to your investment decision.',
            },
            {
                heading: 'The Executive Summary',
                body: 'Every quality stock analysis report starts with an executive summary — a concise overview of the investment thesis. This section answers the most important question first: is this stock worth investigating further? It usually includes a recommendation (buy, hold, or sell), a price target, and two or three reasons that support the thesis. Read this section carefully, but treat it as a starting point, not a conclusion. The detail is in the sections that follow.',
            },
            {
                heading: 'Valuation Metrics',
                body: "Valuation tells you whether a stock is cheap or expensive relative to its earnings, assets, or future cash flows. The most common metric is the Price-to-Earnings (P/E) ratio — the stock price divided by annual earnings per share. A high P/E can mean investors expect strong future growth, or it can mean the stock is simply overpriced. Context matters: compare the P/E against the company's historical average and against peers in the same sector. Other common valuation metrics include EV/EBITDA, Price-to-Sales (P/S), and Price-to-Book (P/B).",
            },
            {
                heading: 'Financial Health',
                body: "The financial health section covers the company's income statement, balance sheet, and cash flow statement. Look for revenue growth (is the business expanding?), profit margins (does it earn efficiently?), and free cash flow (does it generate real cash or just accounting profits?). The balance sheet reveals debt levels — high debt is not always bad, but it amplifies risk. A company with strong cash generation and manageable debt has far more flexibility to survive downturns, invest in growth, and return capital to shareholders.",
            },
            {
                heading: 'Competitive Positioning',
                body: "A company's competitive advantage — its moat — determines whether its profits are sustainable. Analysts look for factors like brand loyalty, network effects, switching costs, and cost advantages. Apple benefits from an ecosystem that makes switching expensive. Visa has a payment network that becomes more valuable as more merchants and users join. Understanding what protects a company from competition is as important as understanding its current earnings. A business with no moat can see its margins eroded quickly by competitors.",
            },
            {
                heading: 'Risk Factors',
                body: 'Every stock analysis report includes a risk section, and it deserves careful attention. Risks are typically categorised as company-specific (management changes, product failures), sector-specific (regulatory changes, commodity prices), and macroeconomic (interest rates, inflation, recessions). Not all risks are equal: some are existential, others are noise. The skill is in judging the probability and impact of each risk and deciding whether you are being adequately compensated through the stock price.',
            },
            {
                heading: 'How AI Analysis Reports Differ',
                body: 'AI-powered stock analysis reports like those from StockBrewAI process the same underlying data — earnings reports, balance sheets, regulatory filings, market data — but deliver structured insights in seconds rather than hours. The output follows the same professional framework: valuation, financial health, competitive positioning, risk, and growth potential. The difference is speed and accessibility. You get institutional-grade analysis without paying for a Bloomberg terminal or waiting for a sell-side research update.',
            },
        ],
    },
    {
        slug: 'what-is-pe-ratio',
        title: 'What Is the P/E Ratio and Why Does It Matter?',
        description:
            "The Price-to-Earnings ratio is one of the most widely used valuation metrics in investing. Here's what it measures, how to interpret it, and when it can mislead you.",
        publishedAt: '2025-04-05',
        readingTimeMinutes: 5,
        sections: [
            {
                body: 'The Price-to-Earnings (P/E) ratio is probably the single most cited number in stock analysis. Open any financial news site and you will see stocks described as trading at "20x earnings" or "50x forward earnings." But what does that actually mean, and how should you use it when evaluating a stock?',
            },
            {
                heading: 'The Basic Calculation',
                body: "The P/E ratio is calculated by dividing a stock's current price by its earnings per share (EPS). If a stock trades at $100 and earns $5 per share annually, its P/E is 20. This means investors are paying $20 for every $1 of annual earnings. You will often see two versions: the trailing P/E (using the last 12 months of actual earnings) and the forward P/E (using analyst estimates for the next 12 months). The forward P/E is usually more relevant for growth-oriented stocks since it reflects where the business is heading, not where it has been.",
            },
            {
                heading: 'What a High or Low P/E Means',
                body: 'A high P/E ratio means the market is paying a premium for the stock. This premium is usually justified by high expected earnings growth — investors are paying today for profits they expect in the future. Tesla, Amazon, and other high-growth companies often trade at elevated P/E ratios for this reason. A low P/E can signal a bargain — or a value trap. Some companies trade cheaply because their business is in structural decline and future earnings are expected to fall. Context is everything: a P/E of 8x for a utility is normal, while the same ratio for a tech company might indicate serious underlying problems.',
            },
            {
                heading: 'Comparing P/E Ratios Correctly',
                body: "The most useful way to interpret a P/E ratio is through comparison. Compare the current P/E against: (1) the company's own historical average — is it more or less expensive than usual? (2) the sector average — does it trade at a premium or discount to peers? (3) the broader market — is this stock cheap or expensive relative to the S&P 500? A tech company trading at a P/E of 30x might look expensive until you realise the sector average is 40x, making it relatively cheap.",
            },
            {
                heading: 'When the P/E Ratio Can Mislead You',
                body: 'The P/E ratio has real limitations. It is meaningless for companies with negative earnings — start-ups, turnaround stories, or businesses in cyclical troughs. It can be distorted by one-off accounting items that inflate or deflate reported earnings. It also ignores debt: two companies with the same P/E can have very different risk profiles if one carries significant debt. For a more complete picture, pair the P/E with metrics like EV/EBITDA (which accounts for debt) and the PEG ratio (which adjusts for growth rate).',
            },
            {
                heading: 'The P/E Ratio in AI Stock Analysis',
                body: 'When StockBrewAI produces a financial analysis, the P/E ratio is one of the first valuation signals it evaluates — alongside sector comparisons, historical averages, and growth-adjusted metrics. This gives you a balanced view rather than a single number in isolation. A stock that looks expensive on trailing P/E might look reasonable on forward P/E if earnings are expected to grow significantly. The AI weighs all of these factors together to give you a complete valuation picture.',
            },
        ],
    },
    {
        slug: 'understanding-competitive-moats',
        title: 'Understanding Competitive Moats in Stock Analysis',
        description:
            'A competitive moat is what protects a company from rivals. Learn the five types of moats, how to identify them, and why they matter for long-term investing.',
        publishedAt: '2025-04-10',
        readingTimeMinutes: 6,
        sections: [
            {
                body: 'Warren Buffett popularised the term "economic moat" to describe a sustainable competitive advantage that protects a business from rivals. Just as a moat around a castle makes it harder to attack, an economic moat makes it harder for competitors to erode a company\'s profits. Companies with wide moats tend to maintain high returns on capital for longer, which is the foundation of long-term stock outperformance.',
            },
            {
                heading: 'The Five Types of Competitive Moats',
                body: "Most moats fall into one of five categories. Cost advantages allow a company to produce goods or services more cheaply than competitors — think Walmart's supply chain or Amazon Web Services's scale. Network effects occur when a product becomes more valuable as more people use it — Visa's payment network and LinkedIn's professional network are classic examples. Switching costs are the friction that makes customers reluctant to change providers — enterprise software like SAP or Salesforce is notoriously difficult to replace. Intangible assets include patents, brands, and regulatory licences — pharmaceutical companies live and die by their patent portfolios, while Apple's brand commands a pricing premium. Finally, efficient scale applies in markets where one or two players serve the entire demand profitably, making new entry unattractive.",
            },
            {
                heading: 'How to Identify a Moat',
                body: 'The clearest sign of a wide moat is sustained high returns on invested capital (ROIC) over many years. If a company consistently earns 20–30% returns on capital while competitors earn 8–10%, something is structurally protecting its profits. Look also at pricing power: can the company raise prices without losing customers? Does the gross margin trend up or hold steady even as the business scales? Are competitors struggling to take market share despite investing heavily? These are all signs that a durable advantage is at work.',
            },
            {
                heading: 'Moat Erosion: What to Watch For',
                body: 'No moat lasts forever. Technology disrupts cost advantages, regulations expire, and consumer tastes shift. Signs that a moat is narrowing include declining gross margins, rising customer churn, increasing price competition, and successful new entrants taking market share. Kodak dominated photography for decades but failed to adapt to digital. Nokia led mobile phones until it could not respond to the smartphone revolution. Monitoring moat integrity is an ongoing task, not a one-time assessment.',
            },
            {
                heading: 'Why Moats Matter More Than Short-Term Earnings',
                body: "A company can have a great quarter and a weak moat. It can also have a difficult year and a wide moat. For long-term investors, the moat is more important than any single earnings report. A wide moat means the company's competitive position gives it time to recover from setbacks, reinvest in growth, and compound returns over years. This is why many professional analysts spend as much time evaluating competitive positioning as they do analysing financial statements.",
            },
            {
                heading: 'Moat Analysis in StockBrewAI',
                body: "StockBrewAI's Competitive Advantage analysis evaluates the five moat types for any stock you analyse. It examines pricing power trends, market share dynamics, switching cost indicators, and network effect strength to give you a structured view of how defensible a company's profits really are — in under 60 seconds.",
            },
        ],
    },
    {
        slug: 'how-to-assess-stock-risk',
        title: 'How to Assess Stock Risk Before You Invest',
        description:
            'Risk is not something to avoid — it is something to understand and price correctly. This guide covers the main types of stock risk and how professional analysts evaluate them.',
        publishedAt: '2025-04-15',
        readingTimeMinutes: 5,
        sections: [
            {
                body: 'Every investment carries risk. The question is never whether risk exists — it always does — but whether you are being adequately compensated for taking it. A stock that could fall 40% in a downturn might still be a great investment if it can triple over five years. Understanding the different types of risk helps you make better judgements about which risks are worth taking.',
            },
            {
                heading: 'Market Risk',
                body: 'Market risk, also called systematic risk, is the risk that affects all stocks at once — a recession, a financial crisis, or a sharp rise in interest rates. No amount of company-specific analysis eliminates market risk entirely. This is why diversification across sectors and asset classes is a core risk management tool. When the market falls 30%, most stocks fall with it regardless of their individual quality. Understanding your exposure to market risk is about portfolio construction as much as individual stock selection.',
            },
            {
                heading: 'Business Risk',
                body: "Business risk is specific to the company you are analysing. It includes the risk that a key product fails, a major customer is lost, or management makes poor capital allocation decisions. It also includes operational risk — supply chain disruptions, cybersecurity incidents, or production failures. When reading a stock analysis report, the business risk section should identify the company's top three to five specific vulnerabilities. These are the risks that could impair the business permanently, not temporarily.",
            },
            {
                heading: 'Financial Risk',
                body: "Financial risk is primarily about a company's debt load. Debt amplifies both gains and losses. A company with $2 billion in revenue and $5 billion in debt is far more vulnerable to a revenue decline than one with no debt. Key metrics to assess financial risk include the net debt-to-EBITDA ratio (how many years of earnings would it take to pay off debt?), the interest coverage ratio (can the company comfortably cover its interest payments?), and the debt maturity schedule (when does the debt need to be refinanced?). High-debt companies are particularly vulnerable to rising interest rates.",
            },
            {
                heading: 'Regulatory and Macro Risk',
                body: 'Some sectors face specific regulatory risks that can dramatically change the business landscape. Pharmaceutical companies face drug approval risk and pricing pressure from healthcare reform. Technology companies face antitrust scrutiny and data privacy regulation. Energy companies face carbon pricing and environmental regulation. Macro risks include currency exposure for companies with significant international revenue, commodity price risk for manufacturers, and geopolitical risk for companies operating in unstable regions.',
            },
            {
                heading: 'Quantifying Risk: Volatility and Beta',
                body: 'Two common quantitative measures of risk are volatility (how much the stock price fluctuates) and beta (how much the stock moves relative to the overall market). A beta of 1.5 means the stock tends to rise 15% when the market rises 10% — and fall 15% when the market falls 10%. High-beta stocks are higher risk but also higher potential reward. These metrics are useful as a starting point but tell you nothing about the specific risks of the business itself.',
            },
            {
                heading: 'Risk Analysis in StockBrewAI',
                body: "StockBrewAI's Risk Analysis report evaluates all four risk dimensions — market, business, financial, and regulatory — for any stock you analyse. It identifies the specific vulnerabilities most likely to affect the company's performance and flags debt levels, covenant risks, and sector-specific threats. This gives you a complete risk picture in under 60 seconds, so you can decide whether the return potential justifies the exposure.",
            },
        ],
    },
    {
        slug: 'what-is-earnings-per-share',
        title: 'What Is Earnings Per Share (EPS) and Why Do Investors Watch It?',
        description:
            'Earnings Per Share is one of the most closely watched metrics in financial markets. Learn what it measures, how to interpret beats and misses, and its role in stock valuation.',
        publishedAt: '2025-04-20',
        readingTimeMinutes: 5,
        sections: [
            {
                body: 'Every quarter, thousands of companies report their earnings. Markets move sharply on these reports — sometimes by 10–20% in a single day. At the centre of this reaction is a single number: earnings per share, or EPS. Understanding what EPS measures, how it is calculated, and what an earnings beat or miss actually means is fundamental to following financial markets.',
            },
            {
                heading: 'The Basic Calculation',
                body: "Earnings per share is calculated by dividing a company's net income (total profit after taxes and expenses) by the number of shares outstanding. If a company earns $1 billion in profit and has 500 million shares outstanding, its EPS is $2.00. The higher the EPS, the more profit each share represents. EPS can be reported on a trailing basis (last 12 months of actual results) or a forward basis (analyst estimates for the next 12 months).",
            },
            {
                heading: 'GAAP vs. Adjusted EPS',
                body: 'Most companies report two EPS figures: GAAP (following standard accounting rules) and adjusted (excluding certain items management considers non-recurring). Adjusted EPS strips out costs like restructuring charges, stock-based compensation, and acquisition-related expenses. This can give a cleaner picture of underlying business performance — but it can also obscure real costs. Always check what is being excluded and whether those exclusions are genuinely one-off or a recurring feature of the business.',
            },
            {
                heading: 'Earnings Beats and Misses',
                body: "The market reaction to an earnings report depends not on the absolute EPS number but on how it compares to analyst expectations. If analysts expected $1.50 EPS and the company reports $1.65, that's a beat — usually positive for the stock. If it reports $1.35, that's a miss — usually negative. The size of the beat or miss matters, but so does the quality: a beat driven by cost-cutting is viewed differently from one driven by revenue growth. Guidance for the next quarter often matters as much as the current result.",
            },
            {
                heading: 'EPS Growth as a Signal',
                body: 'What investors really want to see is consistent EPS growth over time. A company growing EPS at 20% annually is compounding shareholder value rapidly. EPS growth can come from three sources: revenue growth (selling more), margin expansion (keeping more of each dollar sold), and share buybacks (reducing the number of shares outstanding, which increases EPS even if total profit stays flat). Understanding which source is driving growth tells you a lot about the sustainability of that growth.',
            },
            {
                heading: 'EPS in the Context of Valuation',
                body: "EPS is the denominator in the P/E ratio — the most widely used valuation metric. A stock trading at $100 with $5 EPS has a P/E of 20. If next year's EPS is expected to grow to $6.25, the forward P/E drops to 16 — which may make the stock look more attractively valued. EPS estimates drive price targets: most analyst price targets are based on applying an expected P/E multiple to estimated future EPS. When EPS estimates change significantly, price targets and stock prices tend to follow.",
            },
        ],
    },
    {
        slug: 'growth-vs-value-investing',
        title: 'Growth vs. Value Investing: Key Differences and When to Use Each',
        description:
            'Two of the most influential investment philosophies — growth and value — take very different approaches to stock selection. Understanding both helps you build a more resilient portfolio.',
        publishedAt: '2025-04-25',
        readingTimeMinutes: 6,
        sections: [
            {
                body: 'Growth investing and value investing have long been presented as opposing philosophies. In practice, most successful investors blend elements of both. Understanding the core logic of each approach — and when market conditions favour one over the other — is an essential part of building a long-term investment strategy.',
            },
            {
                heading: 'The Value Investing Approach',
                body: 'Value investing, pioneered by Benjamin Graham and popularised by Warren Buffett, is based on buying stocks that trade below their intrinsic value. The idea is simple: markets sometimes misprice securities, and patient investors who buy at a discount to fair value will be rewarded as the gap closes. Value investors focus on metrics like low P/E ratios, low price-to-book ratios, high dividend yields, and strong free cash flow relative to market capitalisation. They are typically buying businesses that are out of favour — facing temporary setbacks, operating in unglamorous industries, or simply overlooked by the market.',
            },
            {
                heading: 'The Growth Investing Approach',
                body: "Growth investing focuses on companies that are expanding rapidly — growing revenue, market share, and earnings faster than the broader economy. Growth investors are willing to pay high valuation multiples for this growth because they expect future earnings to justify today's price. Companies like Amazon, Nvidia, and Shopify spent years trading at high P/E ratios because investors correctly anticipated exceptional future growth. The key question for a growth investor is not whether a stock is cheap today, but whether the growth rate is sustainable and whether the market is underestimating future earnings.",
            },
            {
                heading: 'Risk and Return Profiles',
                body: 'Value stocks tend to offer lower downside risk in market downturns — they are already priced conservatively. But they can underperform in bull markets when investor sentiment favours high-growth businesses. Growth stocks can deliver explosive returns during periods of economic expansion and low interest rates. But they are more sensitive to rising rates (which discount future earnings more heavily) and can fall sharply when growth slows or misses expectations. A portfolio that includes both types of stocks tends to be more resilient across different market environments.',
            },
            {
                heading: 'The Role of Interest Rates',
                body: 'Interest rates have a significant impact on the relative performance of growth and value stocks. When rates are low, the present value of future earnings is higher, which benefits growth stocks. When rates rise sharply — as happened in 2022 — the discount rate applied to future earnings increases, making high-multiple growth stocks more expensive relative to their near-term earnings. Value stocks, with their earnings weighted more toward the present, hold up better in rising rate environments. Understanding the interest rate cycle can help you tilt your portfolio toward the style that is likely to benefit.',
            },
            {
                heading: 'Which Approach Is Right for You?',
                body: 'Neither growth nor value investing is universally superior. Over very long time periods, value stocks have historically outperformed (the "value premium"). But there have been extended periods — sometimes a decade or more — where growth stocks dominated. Your investment horizon, risk tolerance, and the current market environment should all influence your allocation. Many experienced investors own both: value stocks for stability and income, growth stocks for long-term capital appreciation. The key is understanding what you own and why.',
            },
        ],
    },
    {
        slug: 'how-to-analyze-cash-flow',
        title: 'How to Analyse Cash Flow: Why It Matters More Than Profit',
        description:
            'Profit can be manipulated by accounting choices. Cash flow cannot. Learn what free cash flow reveals about a business and why it is the metric professional investors rely on most.',
        publishedAt: '2025-05-01',
        readingTimeMinutes: 6,
        sections: [
            {
                body: '"Revenue is vanity, profit is sanity, cash flow is reality." This old investing adage captures an important truth: a company can report healthy profits while running out of cash. Understanding cash flow analysis is one of the most powerful skills an investor can develop.',
            },
            {
                heading: 'The Three Cash Flow Statements',
                body: 'Every public company publishes three cash flow statements in its financial reports. Operating cash flow measures cash generated by the core business — revenue collected minus expenses paid. This is the most important section: it tells you whether the business actually generates real cash from its operations, independent of accounting choices. Investing cash flow covers capital expenditure (investment in property, equipment, and technology) and acquisitions. Financing cash flow tracks debt issuance and repayment, dividend payments, and share buybacks.',
            },
            {
                heading: 'Why Profit Can Be Misleading',
                body: 'Accounting profit (net income) is calculated using accrual accounting — revenue is recorded when earned, not when cash arrives. A company that sells $10 million of product on credit in December records the revenue immediately, even if payment arrives in March. Non-cash items like depreciation and amortisation also reduce reported profit without affecting cash. This is why two companies can report identical profits while one is generating strong cash and the other is running on fumes.',
            },
            {
                heading: 'Free Cash Flow: The Key Metric',
                body: 'Free cash flow (FCF) is operating cash flow minus capital expenditure. It represents the cash a business generates after maintaining and growing its asset base — the cash that is available to pay dividends, buy back shares, reduce debt, or invest in acquisitions. A company that consistently generates strong free cash flow has financial flexibility. One that consistently burns cash — even while reporting profits — is dependent on external financing and far more vulnerable to market disruptions.',
            },
            {
                heading: 'Free Cash Flow Yield',
                body: 'Free cash flow yield is calculated by dividing free cash flow per share by the stock price. A stock with $5 FCF per share trading at $100 has a FCF yield of 5%. This tells you how much real cash return you are getting per dollar invested — a valuation metric that is much harder to manipulate than earnings-based metrics. A FCF yield above 5% is often considered attractive, particularly in lower-growth, stable businesses. High-growth companies frequently have low or negative FCF yields as they invest heavily in expansion.',
            },
            {
                heading: 'Red Flags in Cash Flow Analysis',
                body: 'Watch for a persistent and widening gap between reported net income and operating cash flow — this can signal aggressive revenue recognition or accounts receivable issues. Rising capital expenditure without corresponding revenue growth may indicate poor capital allocation. And be wary of companies that maintain dividends by taking on debt — a sign that free cash flow does not actually cover shareholder distributions.',
            },
            {
                heading: 'Cash Flow in StockBrewAI Analysis',
                body: "StockBrewAI's Deep Financial Breakdown analysis evaluates free cash flow generation, operating cash flow trends, and capital expenditure patterns for any stock. It flags discrepancies between reported profits and cash generation, giving you a clearer picture of the real financial health behind the headline numbers.",
            },
        ],
    },
    {
        slug: 'what-is-market-cap',
        title: 'What Is Market Capitalisation and What Does It Tell Investors?',
        description:
            'Market cap is more than just the size of a company. It determines index inclusion, affects liquidity, and signals where a stock sits in the risk-return spectrum.',
        publishedAt: '2025-05-05',
        readingTimeMinutes: 4,
        sections: [
            {
                body: 'Market capitalisation — or market cap — is one of the most fundamental concepts in stock investing. It is often used as a shorthand for company size, but it tells you more than that. Understanding what market cap is, how it is calculated, and what it implies about risk and return can help you build a more informed portfolio.',
            },
            {
                heading: 'The Basic Calculation',
                body: "Market cap is calculated by multiplying the current share price by the total number of shares outstanding. If a company has 500 million shares trading at $200 each, its market cap is $100 billion. This number represents the total value the market assigns to the company at any given moment. It fluctuates continuously with the share price, which is why a single announcement can add or remove billions from a company's market cap in hours.",
            },
            {
                heading: 'Market Cap Categories',
                body: 'Companies are typically grouped into categories by market cap. Large-cap companies (generally above $10 billion) are established businesses with stable earnings, wide analyst coverage, and high liquidity. Mid-cap companies ($2–10 billion) offer a middle ground: more growth potential than large caps but more stability than small caps. Small-cap companies (below $2 billion) can deliver exceptional returns but carry higher risk — they are more sensitive to economic downturns, have less access to capital, and are less covered by analysts, which can create both risk and opportunity.',
            },
            {
                heading: 'Market Cap vs. Enterprise Value',
                body: 'Market cap measures only the equity value of a company. Enterprise value (EV) is a more complete measure — it adds debt and subtracts cash. If Company A has a market cap of $10 billion with $5 billion of net debt, its enterprise value is $15 billion. EV is the figure that buyers would actually need to pay to acquire the entire business. Many valuation ratios (like EV/EBITDA) use enterprise value rather than market cap precisely because it captures the full economic value of the business.',
            },
            {
                heading: 'What Market Cap Does Not Tell You',
                body: 'Market cap is a measure of what the market thinks a company is worth — not what it is intrinsically worth. An overvalued large-cap company has a misleadingly high market cap. An undervalued small-cap company looks small even if its underlying business is strong. This is why market cap should always be considered alongside valuation metrics like P/E, EV/EBITDA, and price-to-free cash flow. Size tells you where a company sits in the market structure; valuation tells you whether you are paying a fair price for it.',
            },
            {
                heading: 'Index Inclusion and Market Cap',
                body: "A company's market cap determines which indices it qualifies for — and this has real investment implications. Index inclusion brings automatic buying from passive funds, which increases liquidity and can support the share price. When a company grows large enough to enter the S&P 500 or the FTSE 100, index funds must buy its shares, creating demand independent of any fundamental change in the business. Understanding market cap dynamics is therefore part of understanding the forces that move stock prices.",
            },
        ],
    },
]

export const EDUCATION_HUB_ARTICLE_MAP = new Map(EDUCATION_HUB_ARTICLES.map((a) => [a.slug, a]))
