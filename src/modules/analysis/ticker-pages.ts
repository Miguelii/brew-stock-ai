/* eslint-disable max-lines -- static editorial content, intentional exception */
import type { TickerPage } from '@/types/TickerPage'

/**
 * Every `content` entry must be accurate, durable, and qualitative, and must
 * never fabricate specific figures. Live numbers belong in a generated report,
 * where they are dated. `faq` entries must be answerable only for that company:
 * anything that would read the same with the name swapped is templated filler
 * and belongs nowhere on the site.
 */
export const TICKER_PAGES: TickerPage[] = [
    {
        ticker: 'AAPL',
        name: 'Apple',
        slug: 'apple',
        sector: 'Technology',
        description:
            'Apple Inc. designs and sells consumer electronics, software, and online services. Known for the iPhone, Mac, iPad, and a growing services ecosystem.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Apple designs premium consumer hardware and sells it at high margins, then layers a fast-growing, high-margin Services business (the App Store, iCloud, Apple Music, advertising, and payments) on top of an installed base of over two billion active devices. Hardware drives the ecosystem; Services monetises the loyalty it creates.',
            keyProducts: [
                'iPhone (largest revenue segment)',
                'Mac and iPad',
                'Wearables: Apple Watch and AirPods',
                'Services: App Store, iCloud, Apple Music, Apple Pay, advertising',
                'Accessories and Home',
            ],
            investmentNarrative:
                "The bull case rests on Apple's ecosystem lock-in: high switching costs, brand strength, and a growing Services mix that lifts overall margins and smooths the cyclicality of hardware upgrades. Capital returns are enormous, with consistent buybacks steadily shrinking the share count.\n\nThe bear case is iPhone dependence and saturation in developed markets, regulatory pressure on App Store fees, and a perception that Apple has been slower than peers to ship a clear generative-AI story. The premium valuation also leaves little room for disappointment.",
            keyRisks: [
                'Heavy revenue concentration in the iPhone',
                'Regulatory and antitrust pressure on App Store fees (EU DMA, US litigation)',
                'Exposure to China for both sales and manufacturing',
                'Premium valuation that prices in continued execution',
            ],
            whatToWatch:
                'Watch Services growth and gross margin, iPhone unit trends in China, the pace and reception of Apple Intelligence features, and any regulatory rulings that affect App Store economics. The capital-return cadence (buybacks and dividend) remains a key support for the stock.',
            competitors: ['Samsung', 'Alphabet (Google)', 'Microsoft', 'Huawei', 'Xiaomi'],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'what-is-pe-ratio',
                'stock-buybacks-explained',
            ],
            faq: [
                {
                    question: "Why do investors watch Apple's Services segment so closely?",
                    answer: 'Services carries a much higher gross margin than hardware and its revenue recurs, so every point of mix shift toward Services lifts group profitability without needing more iPhone sales. It also makes results less lumpy: hardware revenue swings with the upgrade cycle, while App Store, iCloud, and advertising revenue arrive steadily from an installed base Apple has already won.',
                },
                {
                    question: 'How does App Store regulation threaten Apple?',
                    answer: "The App Store commission is close to pure profit, so rules that force Apple to allow alternative payment methods or third-party app stores (the EU Digital Markets Act, US litigation) attack the highest-margin part of Services. The revenue at stake is modest relative to Apple's total, but the margin is not, which is why rulings move the stock more than the headline numbers suggest.",
                },
                {
                    question: 'What does Apple do with its cash?',
                    answer: 'Apple returns the bulk of its free cash flow to shareholders through buybacks and a dividend. Sustained repurchases shrink the share count, which lifts earnings per share even when net income is flat, so the buyback pace is itself a driver of reported growth worth tracking alongside the business.',
                },
            ],
        },
    },
    {
        ticker: 'MSFT',
        name: 'Microsoft',
        slug: 'microsoft',
        sector: 'Technology',
        description:
            'Microsoft Corporation develops software, cloud services, and devices. Azure, Office 365, and LinkedIn are among its flagship products.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Microsoft earns the bulk of its profit from enterprise software and cloud infrastructure sold largely by subscription. Its three segments generate durable, recurring, high-margin revenue: Productivity (Microsoft 365, LinkedIn), Intelligent Cloud (Azure, server products), and More Personal Computing (Windows, Xbox, Surface, search).',
            keyProducts: [
                'Azure cloud platform',
                'Microsoft 365 / Office',
                'Windows',
                'LinkedIn',
                'Gaming: Xbox and Activision Blizzard',
                'GitHub and developer tools',
            ],
            investmentNarrative:
                "Bulls point to Azure's secular cloud growth, the deep partnership with OpenAI and Copilot monetisation across the product suite, and one of the strongest balance sheets and recurring-revenue bases in technology. Enterprise switching costs are formidable.\n\nBears focus on the heavy capital expenditure required to build AI data-centre capacity, the uncertainty over how quickly Copilot revenue will scale to justify that spend, and a premium valuation. A deceleration in cloud growth would be the key disappointment.",
            keyRisks: [
                'Massive AI / data-centre capex weighing on free cash flow',
                'Uncertainty over the pace of AI (Copilot) monetisation',
                'Cloud-growth deceleration versus high expectations',
                'Antitrust scrutiny of the OpenAI relationship and gaming acquisitions',
            ],
            whatToWatch:
                'Track Azure growth rates (and how much is AI-driven), capital-expenditure trends, Copilot seat adoption and pricing, and commercial bookings / remaining performance obligations as a forward indicator.',
            competitors: ['Amazon (AWS)', 'Alphabet (Google)', 'Salesforce', 'Oracle', 'Apple'],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'how-to-analyze-cash-flow',
                'roe-vs-roic',
            ],
            faq: [
                {
                    question:
                        'How does Azure differ from AWS and Google Cloud as an investment case?',
                    answer: "Azure's advantage is distribution rather than technology: Microsoft already sells Windows, Office, and Active Directory to nearly every large enterprise, so cloud contracts arrive through existing relationships and enterprise agreements. That lowers customer-acquisition cost and raises switching costs, but it also means Azure growth is tied to enterprise IT budgets rather than to the startup and consumer-internet demand that shaped AWS.",
                },
                {
                    question: 'Why does AI capital expenditure matter so much for Microsoft?',
                    answer: 'Data-centre capacity for AI has to be paid for years before the revenue it enables shows up. Heavy capex depresses free cash flow immediately and raises depreciation for years afterwards, so the market is effectively underwriting a bet that Copilot and Azure AI revenue will arrive fast enough to justify the spend. Capex guidance therefore moves the stock as much as earnings do.',
                },
                {
                    question:
                        'What are remaining performance obligations, and why watch them at Microsoft?',
                    answer: 'Remaining performance obligations are contracted revenue Microsoft has signed but not yet recognised. Because enterprise cloud deals are multi-year, this backlog leads reported revenue by several quarters, making it one of the better forward indicators of whether commercial momentum is accelerating or slowing.',
                },
            ],
        },
    },
    {
        ticker: 'GOOGL',
        name: 'Alphabet',
        slug: 'google',
        sector: 'Technology',
        description:
            "Alphabet Inc. is the parent company of Google, the world's leading search engine, alongside YouTube, Google Cloud, and Waymo.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                "Alphabet generates most of its revenue from advertising across Search, YouTube, and the Google Network, monetising the world's largest base of user-intent data. Google Cloud is a growing second pillar, and 'Other Bets' such as Waymo represent long-dated optionality.",
            keyProducts: [
                'Google Search and advertising',
                'YouTube',
                'Google Cloud Platform',
                'Android and Google Play',
                'Google Workspace',
                'Waymo (autonomous driving)',
            ],
            investmentNarrative:
                "The bull case is Search's dominant economics, YouTube's scale, accelerating Google Cloud profitability, and AI assets (Gemini, DeepMind, custom TPUs) that few rivals can match. The stock has historically traded at a discount to other mega-cap peers.\n\nThe bear case is that generative-AI answer engines could disrupt the traditional search-ad model Alphabet depends on, alongside serious antitrust exposure, including US rulings that could reshape its distribution deals and ad-tech business.",
            keyRisks: [
                'Antitrust rulings affecting Search distribution and the ad-tech stack',
                'Disruption risk to Search from AI chat interfaces',
                'Heavy reliance on advertising, which is cyclical',
                'Large AI capex commitments',
            ],
            whatToWatch:
                'Watch Search revenue resilience as AI Overviews roll out, Google Cloud operating margin, the outcome of US antitrust remedies, and capex versus cloud growth. YouTube advertising and subscription trends matter too.',
            competitors: ['Meta', 'Amazon', 'Microsoft', 'Apple', 'TikTok (ByteDance)'],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'what-is-pe-ratio',
                'how-to-assess-stock-risk',
            ],
            faq: [
                {
                    question: 'Could AI chat assistants actually replace Google Search?',
                    answer: "The risk is not that people stop asking questions, it is that answers get delivered without a results page carrying ads. Alphabet's defence is that high-commercial-intent queries (flights, insurance, products) are exactly the ones users still want to compare and click, and those are where the advertising money is. The bear case is that answering more queries directly reduces the number of monetisable clicks per session.",
                },
                {
                    question: 'What is at stake in the antitrust cases against Alphabet?',
                    answer: "Two separate threads matter. One concerns the payments that make Google the default search engine on other companies' devices and browsers; unwinding them would raise the cost of holding Search share. The other concerns the ad-tech stack, where remedies could force divestiture of parts of the business that sit between advertisers and publishers.",
                },
                {
                    question:
                        'Why has Alphabet often traded at a lower multiple than its mega-cap peers?',
                    answer: 'The market has historically applied a discount for three reasons: concentration in a single, cyclical revenue source (advertising), persistent regulatory overhang, and the losses absorbed by Other Bets. The counter-argument is that Cloud profitability and the AI asset base are worth more than the discount implies.',
                },
            ],
        },
    },
    {
        ticker: 'AMZN',
        name: 'Amazon',
        slug: 'amazon',
        sector: 'Consumer Discretionary',
        description:
            "Amazon.com operates the world's largest e-commerce marketplace and AWS, the leading cloud computing platform.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Amazon runs a high-volume, low-margin e-commerce marketplace and logistics network, but earns the majority of its operating profit from two high-margin engines: Amazon Web Services (cloud) and a fast-growing advertising business. Prime memberships bind the retail flywheel together.',
            keyProducts: [
                'Amazon Web Services (AWS)',
                'Online and physical stores',
                'Third-party seller services (marketplace)',
                'Advertising',
                'Prime subscriptions',
                'Devices and Alexa',
            ],
            investmentNarrative:
                'Bulls highlight AWS as the profit driver, the rapid scaling of a high-margin ads business, and improving retail and logistics efficiency that is lifting North American margins. Operating leverage is the core story.\n\nBears point to AWS competing hard with Azure and Google Cloud, heavy AI-infrastructure spending, thin retail margins exposed to consumer weakness, and ongoing regulatory and labour scrutiny.',
            keyRisks: [
                'Cloud competition and growth deceleration at AWS',
                'Consumer-spending sensitivity in retail',
                'Large capital expenditure for AI and logistics',
                'Regulatory / antitrust and labour-relations pressure',
            ],
            whatToWatch:
                'Track AWS growth and operating margin, advertising revenue growth, North America retail operating margin, and overall capex. AWS backlog and AI-service adoption are forward signals.',
            competitors: [
                'Microsoft (Azure)',
                'Alphabet (Google)',
                'Walmart',
                'Alibaba',
                'Shopify',
            ],
            relatedArticleSlugs: [
                'how-to-analyze-cash-flow',
                'understanding-competitive-moats',
                'what-is-ebitda',
            ],
            faq: [
                {
                    question: 'Why do investors focus on AWS rather than on Amazon retail?',
                    answer: 'Retail moves enormous revenue at very thin margins, while AWS converts a much smaller revenue base into the majority of operating profit. That means group earnings are far more sensitive to a change in AWS growth or margin than to an equivalent change in retail sales, which is why quarterly reactions often ignore the headline revenue line entirely.',
                },
                {
                    question: 'How does advertising fit into Amazon?',
                    answer: 'Amazon sells placement to merchants who already want to reach buyers on its own storefront, at the moment those buyers are ready to purchase. The incremental cost of serving those ads is minimal because the traffic and infrastructure already exist, so advertising has become one of the most profitable parts of the company despite being a fraction of its revenue.',
                },
                {
                    question: 'What does operating leverage mean for Amazon?',
                    answer: 'Amazon spent years building fulfilment and logistics capacity ahead of demand. Once that capacity is in place, additional volume flows through it at a much lower incremental cost, so profits can grow considerably faster than revenue. The reverse is also true: when Amazon starts a new build-out cycle, margins compress before they recover.',
                },
            ],
        },
    },
    {
        ticker: 'TSLA',
        name: 'Tesla',
        slug: 'tesla',
        sector: 'Consumer Discretionary',
        description:
            'Tesla Inc. designs and manufactures electric vehicles, energy storage systems, and solar products. A leader in EV adoption globally.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Tesla makes most of its revenue selling electric vehicles directly to consumers, supplemented by an energy generation and storage business and a services / software segment that includes Supercharging and Full Self-Driving. The long-term thesis hinges increasingly on autonomy, AI, and robotics rather than vehicle volumes alone.',
            keyProducts: [
                'Model 3 / Model Y / Model S / Model X',
                'Cybertruck',
                'Energy storage (Powerwall, Megapack)',
                'Supercharger network',
                'Full Self-Driving (FSD) software',
                'Optimus humanoid robot (in development)',
            ],
            investmentNarrative:
                'Bulls value Tesla as more than an automaker, betting on autonomy (robotaxi), energy-storage growth, manufacturing scale, and AI / robotics optionality that could justify a software-like valuation.\n\nBears note that Tesla is valued far above traditional automakers while facing slowing delivery growth, price cuts that compress automotive margins, intensifying EV competition (especially from China), and a valuation heavily dependent on FSD / robotaxi promises that remain unproven at scale.',
            keyRisks: [
                'Automotive margin compression from price cuts',
                'Intensifying EV competition, notably from Chinese makers',
                'Valuation dependent on unproven autonomy / robotaxi outcomes',
                'Key-person and governance risk tied to its CEO',
            ],
            whatToWatch:
                'Watch vehicle delivery growth and automotive gross margin (excluding regulatory credits), energy-storage deployments, FSD / robotaxi progress and regulatory approvals, and average selling prices versus incentives.',
            competitors: [
                'BYD',
                'Legacy automakers (GM, Ford, Volkswagen, Toyota)',
                'Rivian',
                'Lucid',
            ],
            relatedArticleSlugs: [
                'how-to-assess-stock-risk',
                'what-is-pe-ratio',
                'behavioral-biases-investing',
            ],
            faq: [
                {
                    question: 'Why is Tesla valued so differently from other carmakers?',
                    answer: 'Traditional automakers are valued on low multiples because vehicle manufacturing is capital-intensive, cyclical, and competitive. Tesla trades far above that because a large part of its market value rests on outcomes outside car sales: autonomy licensed as software, energy storage, and robotics. Whether that premium is justified depends entirely on those non-automotive outcomes arriving, which is the single biggest disagreement between bulls and bears.',
                },
                {
                    question: 'Why exclude regulatory credits when looking at automotive margin?',
                    answer: 'Regulatory credits are sold to other manufacturers to help them meet emissions rules, and they carry essentially no cost, so they flow straight to profit. They are also finite and shrink as competitors electrify their own fleets. Stripping them out shows the margin the core vehicle business actually earns, which is the number that has to hold up over time.',
                },
                {
                    question: 'What would robotaxi approval change for Tesla?',
                    answer: 'A vehicle that earns revenue while its owner is not driving changes the economics of the fleet already on the road, and turns a one-time hardware sale into a recurring stream. That is the mechanism behind the software-like valuation. It also depends on regulatory approval jurisdiction by jurisdiction, which makes the timeline hard to underwrite.',
                },
            ],
        },
    },
    {
        ticker: 'NVDA',
        name: 'NVIDIA',
        slug: 'nvidia',
        sector: 'Technology',
        description:
            'NVIDIA Corporation designs GPUs and system-on-chip units. Dominant in AI training hardware, data centres, and gaming graphics.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'NVIDIA designs the GPUs and networking that have become the default hardware for training and running AI models, and pairs them with the CUDA software platform that locks in developers. Its Data Center segment now dominates revenue, supplemented by gaming, professional visualisation, and automotive.',
            keyProducts: [
                'Data Center GPUs (e.g. H100 / Blackwell)',
                'CUDA software ecosystem',
                'Networking (Mellanox / InfiniBand)',
                'GeForce gaming GPUs',
                'Professional visualisation and automotive / robotics chips',
            ],
            investmentNarrative:
                "The bull case is NVIDIA's commanding position in AI accelerators, the CUDA software moat, and a multi-year build-out of AI data centres by cloud providers and enterprises. Margins and growth have been extraordinary.\n\nThe bear case is customer concentration in a handful of hyperscalers, the cyclicality and potential digestion of AI capex, rising competition from AMD and customers' own custom silicon, and export restrictions to China. Expectations are very high.",
            keyRisks: [
                'Concentration in a few large cloud customers',
                'AI capex cyclicality and potential overbuild / digestion',
                'Competition from AMD and in-house hyperscaler chips',
                'US export controls limiting China sales',
            ],
            whatToWatch:
                'Watch Data Center revenue growth and gross margin, hyperscaler capex guidance, the ramp of new architectures, supply and lead times, and China-related export-control developments.',
            competitors: [
                'AMD',
                'Intel',
                'Broadcom',
                'Custom silicon from Google, Amazon, and Microsoft',
            ],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'what-is-pe-ratio',
                'how-to-assess-stock-risk',
            ],
            faq: [
                {
                    question: "What is CUDA, and why is it described as NVIDIA's real moat?",
                    answer: 'CUDA is the software layer researchers and engineers use to program NVIDIA hardware. Nearly two decades of libraries, tooling, and tutorials assume it, and most machine-learning frameworks were optimised against it first. A competitor can match the silicon and still lose the sale, because switching means porting and revalidating code that already works. The moat is the accumulated software, not the chip.',
                },
                {
                    question: 'Why is customer concentration a risk for NVIDIA?',
                    answer: 'A large share of data-centre revenue comes from a handful of hyperscale cloud providers. Those same customers are designing their own accelerators, so they are simultaneously the source of the demand and the most credible long-term threat to it. A single one of them slowing its build-out has an outsized effect on quarterly results.',
                },
                {
                    question: 'What would an AI capex digestion phase look like?',
                    answer: 'Semiconductor demand has historically arrived in waves: customers over-order during a build-out, then pause to absorb the capacity they already installed. If AI infrastructure follows that pattern, revenue would flatten or fall for several quarters without the long-term thesis being wrong. Distinguishing a pause from a structural break is the central judgement for holders.',
                },
            ],
        },
    },
    {
        ticker: 'META',
        name: 'Meta',
        slug: 'meta',
        sector: 'Technology',
        description:
            'Meta Platforms operates Facebook, Instagram, and WhatsApp, reaching over 3 billion daily active users. Expanding into AI and the metaverse.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                "Meta earns almost all of its revenue from advertising across Facebook, Instagram, WhatsApp, and Messenger, its 'Family of Apps' reaching billions of daily users. It reinvests heavily in AI (for ad targeting and content recommendation) and in Reality Labs, its long-term metaverse and AR / VR bet.",
            keyProducts: [
                'Facebook',
                'Instagram',
                'WhatsApp',
                'Messenger',
                'Reality Labs (Quest, AR / VR)',
                'Llama AI models',
            ],
            investmentNarrative:
                "Bulls cite Meta's enormous engaged user base, AI-driven improvements to ad targeting and Reels monetisation, disciplined cost control after the 'Year of Efficiency', and strong free cash flow funding buybacks.\n\nBears focus on the deep, persistent operating losses at Reality Labs, the cyclicality of digital advertising, platform and regulatory risk (privacy rules, antitrust), and competition for attention from TikTok.",
            keyRisks: [
                'Large ongoing Reality Labs losses',
                'Advertising cyclicality and privacy / platform regulation',
                'Competition from TikTok for engagement',
                'Antitrust scrutiny',
            ],
            whatToWatch:
                'Track ad revenue growth and pricing / impressions, Reels and AI engagement gains, Reality Labs spending and losses, AI capex, and daily active people across the app family.',
            competitors: [
                'Alphabet (Google)',
                'TikTok (ByteDance)',
                'Snap',
                'Pinterest',
                'Amazon (ads)',
            ],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'how-to-analyze-cash-flow',
                'behavioral-biases-investing',
            ],
            faq: [
                {
                    question: 'What is Reality Labs and why does it lose money?',
                    answer: 'Reality Labs is the segment building augmented and virtual reality hardware, software, and platforms. It is a deliberate long-horizon investment: Meta is funding a computing platform it does not yet own, so that it never again depends on a rival controlling the operating system and app-store rules its apps run under. The losses are the price of that option, and they are reported separately so investors can value the advertising business on its own.',
                },
                {
                    question: 'How does privacy regulation affect Meta?',
                    answer: "Ad targeting works best with signal about what users do outside Meta's own apps. Platform-level privacy changes and regulation restrict that signal, which reduces measured conversion and therefore what advertisers will pay per impression. Meta's response has been to rebuild targeting with on-platform AI modelling, which reduces the dependency but does not eliminate it.",
                },
                {
                    question:
                        'Why does Meta report daily active people across the whole app family?',
                    answer: "Users overlap heavily between Facebook, Instagram, WhatsApp, and Messenger, so adding each app's users would double-count. The family-level figure measures the actual reach available to advertisers, which is the number that matters commercially.",
                },
            ],
        },
    },
    {
        ticker: 'NFLX',
        name: 'Netflix',
        slug: 'netflix',
        sector: 'Communication Services',
        description:
            "Netflix is the world's largest subscription streaming service with over 260 million paid subscribers across 190 countries.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Netflix is a subscription streaming service that monetises a global content library across tiered plans, and increasingly through a fast-growing ad-supported tier and a paid-sharing initiative. Scale lets it spread heavy content spending across hundreds of millions of members.',
            keyProducts: [
                'Standard and Premium subscription plans',
                'Ad-supported tier',
                'Original films and series',
                'Licensed content',
                'Games (mobile)',
                'Live events and sports (emerging)',
            ],
            investmentNarrative:
                "Bulls highlight Netflix's global scale advantage, improving free cash flow as content spend matures, new growth levers from advertising and paid sharing, and pricing power from a deep content slate.\n\nBears point to a maturing subscriber base in developed markets, intense competition from Disney, Amazon, and others, content-cost inflation, and a premium valuation that requires sustained margin expansion.",
            keyRisks: [
                'Subscriber saturation in mature markets',
                'Intense streaming competition and content-cost inflation',
                'Foreign-exchange exposure from international revenue',
                'Execution risk in scaling advertising',
            ],
            whatToWatch:
                "Track membership additions, average revenue per member, the ad tier's scaling and ad revenue, operating-margin expansion, and free cash flow. Engagement and content-slate strength are leading indicators.",
            competitors: [
                'Disney+',
                'Amazon Prime Video',
                'Warner Bros. Discovery (Max)',
                'Apple TV+',
                'YouTube',
            ],
            relatedArticleSlugs: [
                'what-is-pe-ratio',
                'how-to-analyze-cash-flow',
                'understanding-competitive-moats',
            ],
            faq: [
                {
                    question: "How does the ad-supported tier change Netflix's economics?",
                    answer: 'It breaks the link between price and revenue per user. A cheaper plan brings in members who would not pay full price, and Netflix then earns from them twice: a smaller subscription fee plus advertising revenue. Whether that is accretive depends on how much advertisers pay per viewing hour, which is why ad revenue per member matters more than raw subscriber counts on the ad tier.',
                },
                {
                    question: 'Is Netflix running out of people to sign up?',
                    answer: 'In mature markets, largely yes, which is why the growth narrative moved from adding members to earning more per member through pricing, paid sharing, and advertising. Emerging markets still add volume but at lower average revenue, so mix shift can depress the average even when the business is growing.',
                },
                {
                    question: 'Why does content spending make Netflix hard to value on earnings?',
                    answer: 'Content is capitalised and then amortised over years rather than expensed when the cheque is written, so reported profit and actual cash outflow can diverge significantly. Free cash flow is the more honest measure of whether the content slate is paying for itself.',
                },
            ],
        },
    },
    {
        ticker: 'AMD',
        name: 'AMD',
        slug: 'amd',
        sector: 'Technology',
        description:
            'Advanced Micro Devices designs CPUs and GPUs for PCs, data centres, and gaming consoles. A strong competitor to Intel and NVIDIA.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'AMD designs high-performance CPUs and GPUs and outsources manufacturing to foundries (chiefly TSMC). It competes across data-centre processors and AI accelerators, PC client chips, gaming consoles (semi-custom), and embedded markets (boosted by its Xilinx acquisition).',
            keyProducts: [
                'EPYC server CPUs',
                'Instinct AI accelerators (MI series)',
                'Ryzen PC processors',
                'Radeon GPUs',
                'Semi-custom console chips',
                'Embedded / FPGA (Xilinx)',
            ],
            investmentNarrative:
                'Bulls see AMD as the clearest second source to NVIDIA in AI accelerators and a persistent share-gainer against Intel in server and PC CPUs, with a credible data-centre GPU roadmap.\n\nBears note that AMD’s AI GPU revenue is a fraction of NVIDIA’s, its ROCm software lags CUDA, the business is cyclical, and the stock often prices in optimistic AI share gains that still have to be proven.',
            keyRisks: [
                'Distant second to NVIDIA in AI GPUs and software ecosystem',
                'Cyclical PC and gaming demand',
                'Dependence on TSMC for leading-edge manufacturing',
                'High expectations embedded in the valuation',
            ],
            whatToWatch:
                'Watch the data-centre GPU (Instinct) revenue ramp and guidance, server CPU share gains, PC client recovery, and the gross-margin trajectory as the mix shifts toward data centre.',
            competitors: ['NVIDIA', 'Intel', 'Broadcom', 'Qualcomm'],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'how-to-assess-stock-risk',
                'what-is-pe-ratio',
            ],
            faq: [
                {
                    question: 'Can AMD realistically catch NVIDIA in AI accelerators?',
                    answer: 'On silicon, AMD is competitive. The harder gap is software: ROCm is younger and less complete than CUDA, and buyers weigh engineering time spent porting models against the price they save on hardware. The realistic bull case is not displacement but a credible second source, because large buyers actively want one to avoid depending on a single supplier.',
                },
                {
                    question: 'Why does AMD depend on TSMC?',
                    answer: 'AMD is fabless: it designs chips and contracts out manufacturing. That avoids the enormous capital cost of owning leading-edge fabs, but it means capacity allocation, pricing, and process timing are decided by a supplier AMD shares with its competitors, and concentrates a large part of its supply chain in one geography.',
                },
                {
                    question: "Why does AMD's gross margin trend matter more than revenue growth?",
                    answer: 'AMD sells across very different businesses: data-centre parts carry high margins, while console semi-custom chips carry low ones. Group gross margin therefore reveals which segments are actually driving the quarter. Revenue can grow on a mix that makes the company less profitable.',
                },
            ],
        },
    },
    {
        ticker: 'JPM',
        name: 'JPMorgan Chase',
        slug: 'jpmorgan',
        sector: 'Financials',
        description:
            'JPMorgan Chase is the largest US bank by assets, offering investment banking, consumer banking, financial services, and asset management.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'JPMorgan is a diversified, globally systemic bank earning money from net interest income (the spread on loans and deposits) and fee income across consumer banking, corporate and investment banking, asset and wealth management, and commercial banking. Scale and a fortress balance sheet are central to the model.',
            keyProducts: [
                'Consumer & Community Banking',
                'Corporate & Investment Bank (trading, advisory, underwriting)',
                'Asset & Wealth Management',
                'Commercial Banking',
                'Credit cards and payments',
            ],
            investmentNarrative:
                'Bulls view JPMorgan as the best-run large US bank: diversified, well-capitalised, and a share-gainer through cycles, with strong returns on tangible equity and disciplined risk management.\n\nBears note that bank earnings are cyclical and rate-sensitive: net interest income can compress as rates fall, credit losses rise in downturns, and tighter capital rules can limit buybacks. Banks are also macro-exposed and hard to value at a premium.',
            keyRisks: [
                'Credit losses rising in an economic downturn',
                'Net interest income sensitivity to interest-rate changes',
                'Regulatory capital requirements constraining returns',
                'Capital-markets revenue volatility',
            ],
            whatToWatch:
                'Watch net interest income guidance, credit-loss provisions and charge-off trends, return on tangible common equity, capital ratios (CET1), and investment-banking / trading revenue.',
            competitors: [
                'Bank of America',
                'Wells Fargo',
                'Citigroup',
                'Goldman Sachs',
                'Morgan Stanley',
            ],
            relatedArticleSlugs: [
                'how-to-read-a-balance-sheet',
                'how-interest-rates-move-stocks',
                'how-to-assess-stock-risk',
            ],
            faq: [
                {
                    question: 'How do interest rates affect JPMorgan?',
                    answer: 'Banks earn a spread between what they pay depositors and what they charge borrowers. Rising rates usually widen that spread first, because loan rates reprice faster than deposit rates, which lifts net interest income. The effect reverses as deposits reprice and, if rates rose because the economy is overheating, higher borrowing costs eventually increase defaults. Rate moves are therefore good for earnings before they are bad for them.',
                },
                {
                    question: 'What is CET1, and why do bank investors watch it?',
                    answer: "Common Equity Tier 1 is the regulatory measure of a bank's highest-quality capital against its risk-weighted assets. It caps how much a bank can return to shareholders: capital held to satisfy the ratio cannot be paid out as buybacks or dividends. A change in required CET1 directly changes the capital-return story regardless of how well the business is performing.",
                },
                {
                    question:
                        'Why is return on tangible common equity used instead of profit margin?',
                    answer: "A bank's profitability depends on how much capital it must hold against its assets, not just on what it earns. Return on tangible common equity measures profit against the equity actually at risk, which is what makes results comparable between banks of different sizes and business mixes.",
                },
            ],
        },
    },
    {
        ticker: 'V',
        name: 'Visa',
        slug: 'visa',
        sector: 'Financials',
        description:
            "Visa Inc. operates the world's largest retail electronic payments network, processing billions of transactions annually across 200+ countries.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Visa operates a global payments network that connects banks, merchants, and cardholders, earning fees on the volume and number of transactions that flow across its rails. It does not lend or take credit risk. It is a high-margin toll-taker on the secular shift from cash to digital payments.',
            keyProducts: [
                'Credit and debit network processing',
                'Cross-border transaction services',
                'Value-added services (fraud, data, consulting)',
                'Visa Direct (real-time money movement)',
                'Tokenisation and security products',
            ],
            investmentNarrative:
                "Bulls love Visa's network-effect moat, near-incremental margins, resilience to credit cycles (it takes no credit risk), and the long runway as cash and cheques continue migrating to digital payments globally.\n\nBears point to regulatory and litigation risk around interchange fees, the threat of account-to-account and real-time payment rails bypassing card networks, and a premium valuation that assumes steady volume growth.",
            keyRisks: [
                'Regulatory and litigation pressure on interchange fees',
                'Disruption from account-to-account / real-time payment rails',
                'Consumer-spending sensitivity to recessions',
                'Cross-border (travel) volume volatility',
            ],
            whatToWatch:
                'Track payments-volume growth, cross-border volume (a high-margin driver), value-added services growth, and any regulatory action on interchange. Operating-margin stability is a key quality signal.',
            competitors: [
                'Mastercard',
                'American Express',
                'PayPal',
                'Real-time payment networks',
                'Block',
            ],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'roe-vs-roic',
                'what-is-pe-ratio',
            ],
            faq: [
                {
                    question: 'Does Visa lend money or take credit risk?',
                    answer: 'No. The issuing bank extends the credit and absorbs the losses if a cardholder does not pay. Visa operates the network that authorises, clears, and settles the transaction, and earns a fee on it. That distinction is why Visa holds up better than lenders in a credit downturn: it is exposed to how much people spend, not to whether they repay.',
                },
                {
                    question: "What is the network effect behind Visa's moat?",
                    answer: 'Merchants accept Visa because cardholders carry it, and cardholders carry it because merchants accept it. Each new participant makes the network more valuable to the other side, and a challenger has to solve both sides at once to compete. Decades of accumulated acceptance infrastructure make that extremely expensive to replicate.',
                },
                {
                    question: 'Why does cross-border volume get watched separately?',
                    answer: 'Cross-border transactions carry substantially higher fees than domestic ones, so they contribute disproportionately to revenue. They are also tied to international travel, which makes them more volatile than domestic spending and sensitive to events that have nothing to do with payments.',
                },
            ],
        },
    },
    {
        ticker: 'DIS',
        name: 'Disney',
        slug: 'disney',
        sector: 'Communication Services',
        description:
            'The Walt Disney Company is a diversified entertainment conglomerate with theme parks, studios, streaming (Disney+), and broadcast networks.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Disney monetises its intellectual property across three pillars: Entertainment (film studios, linear TV, and Disney+ streaming), Sports (ESPN), and Experiences (theme parks, resorts, cruises, and consumer products). Its franchises feed all three, creating a flywheel from screen to park to merchandise.',
            keyProducts: [
                'Disney+ and Hulu streaming',
                'Film studios (Disney, Pixar, Marvel, Lucasfilm)',
                'ESPN and sports',
                'Theme parks and resorts',
                'Cruise line',
                'Consumer products and licensing',
            ],
            investmentNarrative:
                'Bulls focus on the path to streaming profitability, the irreplaceable IP and franchise library, and the high-margin, high-demand Experiences (parks) segment that funds the business.\n\nBears point to the structural decline of high-margin linear TV and the cable bundle, the cost of the streaming transition, content-hit dependence, and execution / succession questions. Parks demand is also economically sensitive.',
            keyRisks: [
                'Secular decline of linear TV and the cable bundle',
                'Streaming profitability and content-spend discipline',
                'Cyclicality of theme-park (Experiences) demand',
                'Reliance on box-office hits and franchise fatigue',
            ],
            whatToWatch:
                "Watch direct-to-consumer (streaming) operating profitability, Disney+ subscriber and ARPU trends, Experiences segment operating income, and the strategic path for ESPN's streaming transition.",
            competitors: [
                'Netflix',
                'Warner Bros. Discovery',
                'Comcast (NBCUniversal)',
                'Paramount',
            ],
            relatedArticleSlugs: [
                'how-to-analyze-cash-flow',
                'understanding-competitive-moats',
                'how-to-assess-stock-risk',
            ],
            faq: [
                {
                    question: 'Why does the decline of cable TV hurt Disney so much?',
                    answer: 'Carriage fees from the cable bundle were paid per subscriber whether or not anyone watched, which made linear television extraordinarily profitable. Streaming replaces that with a lower-priced, cancel-anytime relationship that costs more to serve. Disney is trading high-margin declining revenue for lower-margin growing revenue, and the gap between the two is the core of the transition problem.',
                },
                {
                    question: 'Why do the theme parks matter so much to the investment case?',
                    answer: 'Experiences converts intellectual property created elsewhere in the company into high-margin, hard-to-replicate revenue, and it has generated the profit funding the streaming build-out. It is also the most economically sensitive part of Disney, because a park visit is a large discretionary purchase families defer in a downturn.',
                },
                {
                    question:
                        'What makes the Disney flywheel different from a normal media library?',
                    answer: 'A successful film does not just earn at the box office: it becomes a park attraction, a cruise theme, a merchandise line, and a streaming catalogue title. Each franchise is monetised repeatedly across segments over decades, which is why Disney is valued on its IP rather than on any single release.',
                },
            ],
        },
    },
    {
        ticker: 'WMT',
        name: 'Walmart',
        slug: 'walmart',
        sector: 'Consumer Staples',
        description:
            "Walmart is the world's largest retailer by revenue, operating thousands of stores globally and a fast-growing e-commerce business.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                "Walmart is the world's largest retailer, using enormous scale and purchasing power to offer low prices across groceries and general merchandise. It increasingly monetises higher-margin streams on top of the low-margin retail base: e-commerce, a third-party marketplace, advertising (Walmart Connect), and membership (Walmart+).",
            keyProducts: [
                'Walmart US supercenters and groceries',
                "Sam's Club membership warehouses",
                'Walmart International',
                'E-commerce and marketplace',
                'Walmart Connect advertising',
                'Walmart+ membership',
            ],
            investmentNarrative:
                'Bulls highlight Walmart’s defensive scale, grocery dominance, and the growth of high-margin advertising and marketplace revenue that is structurally lifting profitability, plus share gains among higher-income shoppers.\n\nBears point to thin retail margins, intense competition from Amazon and Costco, wage and cost inflation, and a valuation that has risen as investors reward the advertising and omnichannel story.',
            keyRisks: [
                'Thin core-retail margins sensitive to cost inflation',
                'Intense competition from Amazon and Costco',
                'Consumer-spending and trade-down dynamics',
                'Execution risk in scaling advertising / marketplace',
            ],
            whatToWatch:
                'Track US comparable-store sales, e-commerce growth, advertising (Walmart Connect) revenue, the operating-margin trend, and grocery market share. Higher-income customer acquisition is a key narrative.',
            competitors: ['Amazon', 'Costco', 'Target', 'Kroger', 'Dollar General'],
            relatedArticleSlugs: [
                'understanding-competitive-moats',
                'how-to-analyze-cash-flow',
                'what-is-ebitda',
            ],
            faq: [
                {
                    question: "Why does Walmart's advertising business matter to investors?",
                    answer: 'Retail sells goods at a few cents of profit per dollar. Advertising sold against traffic Walmart already has costs almost nothing incrementally, so a small amount of ad revenue can move group operating profit as much as a very large amount of merchandise revenue. It is the main reason the market re-rated a business it used to value purely as a grocer.',
                },
                {
                    question: 'How does Walmart actually compete with Amazon?',
                    answer: 'Its advantage is physical proximity: stores within a short drive of most of the US population double as fulfilment and pickup points, which makes fast grocery delivery economical in a way a pure warehouse network struggles to match. Groceries also bring customers back weekly, giving Walmart a purchase frequency that general-merchandise competitors do not have.',
                },
                {
                    question: 'What does trade-down mean for Walmart?',
                    answer: 'When household budgets tighten, shoppers move from more expensive retailers to cheaper ones. Walmart tends to gain customers in exactly the conditions that hurt most retailers, including higher-income shoppers who stay after the pressure eases. It makes the stock behave defensively relative to the rest of the sector.',
                },
            ],
        },
    },
    {
        ticker: 'JNJ',
        name: 'Johnson & Johnson',
        slug: 'johnson-and-johnson',
        sector: 'Healthcare',
        description:
            'Johnson & Johnson is a diversified healthcare company with leading businesses in pharmaceuticals, medical devices, and consumer health products.',
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Johnson & Johnson is a diversified healthcare company operating in two segments after spinning off its consumer-health unit (Kenvue): Innovative Medicine (branded pharmaceuticals) and MedTech (medical devices). Patent-protected drugs and a broad device portfolio generate stable, defensive cash flows.',
            keyProducts: [
                'Innovative Medicine: oncology, immunology, and neuroscience drugs',
                'MedTech: surgical, orthopaedics, cardiovascular, and vision devices',
                'Pharmaceutical pipeline therapies',
            ],
            investmentNarrative:
                'Bulls view J&J as a defensive, high-quality healthcare compounder with a diversified drug and device portfolio, a deep pipeline, and a long record of dividend increases (a Dividend King).\n\nBears focus on patent-cliff risk for key drugs (notably biosimilar competition for Stelara), the talc-related litigation overhang, and the slower growth typical of large-cap pharma.',
            keyRisks: [
                'Patent cliffs and biosimilar competition for major drugs',
                'Talc and other product-liability litigation',
                'Drug-pricing regulation and reform',
                'Pipeline and clinical-trial setbacks',
            ],
            whatToWatch:
                'Watch pharmaceutical pipeline progress and new-drug launches offsetting patent expiries, MedTech growth, litigation resolution, and dividend growth. Operating-margin stability signals quality.',
            competitors: ['Pfizer', 'Merck', 'AbbVie', 'Medtronic', 'Abbott Laboratories'],
            relatedArticleSlugs: [
                'how-dividends-actually-work',
                'how-to-assess-stock-risk',
                'dividend-growth-investing',
            ],
            faq: [
                {
                    question: 'What is a patent cliff?',
                    answer: 'Branded drugs are protected by patents for a fixed period. When protection lapses, generic or biosimilar versions enter at much lower prices and the original product can lose most of its revenue within a couple of years. Because that revenue carried very high margins, the profit impact is larger than the revenue impact, and it arrives on a known date, which is why pipelines are valued against scheduled expiries.',
                },
                {
                    question: 'What was the Kenvue spin-off?',
                    answer: 'Johnson & Johnson separated its consumer-health business, the household brands sold over the counter, into an independent company called Kenvue. What remains is a focused pharmaceutical and medical-device company with higher growth and higher risk: consumer health was the slowest-growing but most predictable part of the old group.',
                },
                {
                    question: 'How should investors think about the talc litigation?',
                    answer: 'Product-liability litigation of this scale creates an overhang because the eventual cost and timing are both unknown, and markets discount uncertainty more harshly than they discount a large but defined liability. Resolution tends to matter to the share price out of proportion to the amount finally paid.',
                },
            ],
        },
    },
    {
        ticker: 'KO',
        name: 'Coca-Cola',
        slug: 'coca-cola',
        sector: 'Consumer Staples',
        description:
            "The Coca-Cola Company is the world's largest beverage company, with 200+ brands sold in 200+ countries. Known for its iconic brand and high dividend consistency.",
        content: {
            updatedAt: '2026-07-02',
            businessModel:
                'Coca-Cola is primarily a brand and concentrate company: it sells concentrates and syrups to a global network of bottling partners, focusing its own capital on marketing and brand-building rather than capital-intensive bottling. This asset-light model produces high margins and steady cash flow across 200+ countries.',
            keyProducts: [
                'Coca-Cola and Trademark sparkling brands',
                'Water, sports, coffee, and tea (smartwater, Powerade, Costa)',
                'Juice, dairy, and plant-based beverages',
                'Concentrate and syrup sales to bottlers',
            ],
            investmentNarrative:
                'Bulls value Coca-Cola as a defensive dividend-growth compounder: an iconic brand moat, global distribution, pricing power that helps offset inflation, and a decades-long record of rising dividends (a Dividend King).\n\nBears note slow volume growth in a maturing category, shifting consumer preferences away from sugary drinks, foreign-exchange headwinds from heavy international exposure, and a valuation that is full for a low-growth staple.',
            keyRisks: [
                'Health / regulatory trends and sugar taxes pressuring volumes',
                'Significant foreign-exchange exposure',
                'Slow organic volume growth in a mature category',
                'Input-cost and commodity inflation',
            ],
            whatToWatch:
                'Watch organic revenue growth (price / mix versus volume), operating margin, currency-neutral results, and dividend growth. Market-share trends in key emerging markets matter for the long-term story.',
            competitors: ['PepsiCo', 'Keurig Dr Pepper', 'Nestlé', 'Private-label beverages'],
            relatedArticleSlugs: [
                'how-dividends-actually-work',
                'dividend-growth-investing',
                'understanding-competitive-moats',
            ],
            faq: [
                {
                    question: 'What does it mean that Coca-Cola is a Dividend King?',
                    answer: 'A Dividend King has raised its dividend every year for at least fifty consecutive years. The label matters less as a badge than as evidence: sustaining that record through multiple recessions requires cash generation stable enough that management never had to choose between the dividend and the business. It also creates a strong institutional reluctance to ever cut, which is itself a form of commitment to shareholders.',
                },
                {
                    question: 'Why is Coca-Cola called an asset-light business?',
                    answer: 'Coca-Cola largely sells concentrate to independent bottlers rather than running bottling plants and delivery fleets itself. The capital-intensive, low-margin part of the value chain sits with partners, while Coca-Cola keeps the brand, the formula, and the marketing. That structure produces high margins and high returns on capital from a relatively small asset base.',
                },
                {
                    question: 'Why do currency movements matter so much to Coca-Cola?',
                    answer: 'A large share of revenue is earned outside the United States but reported in dollars, so a strong dollar shrinks reported results even when local-currency sales grow. This is why Coca-Cola reports currency-neutral organic growth alongside the headline numbers, and why the two can point in opposite directions.',
                },
            ],
        },
    },
]

/**
 * Case-insensitive lookup keyed by both the lowercased slug AND the lowercased
 * ticker symbol. Tickers are added first so a slug always wins on the unlikely
 * event of a slug/ticker collision (the slug is the canonical identity).
 */
const TICKER_LOOKUP = new Map<string, TickerPage>()
for (const t of TICKER_PAGES) TICKER_LOOKUP.set(t.ticker.toLowerCase(), t)
for (const t of TICKER_PAGES) TICKER_LOOKUP.set(t.slug.toLowerCase(), t)

/**
 * Resolve a ticker page from a raw route param, matching either the slug or the
 * ticker symbol, case-insensitively (e.g. `google`, `GOOGL`, `googl` all resolve
 * to Alphabet). `generateStaticParams` still emits only canonical slugs — this
 * just lets the dynamic route additionally serve ticker- and uppercase-based URLs.
 */
export const resolveTickerPage = (param: string): TickerPage | undefined =>
    TICKER_LOOKUP.get(param.toLowerCase())
