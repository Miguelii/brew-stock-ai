/* eslint-disable max-lines -- static editorial content, intentional exception */
import type { TickerContent } from '@/types/TickerPage'

/**
 * Long-form, unique editorial content keyed by ticker slug. A ticker is only
 * treated as indexable once it has an entry here (see `isTickerEnriched` in
 * `@/lib/ticker-pages`). Add entries incrementally; every entry must be
 * accurate, durable, and qualitative — never fabricate specific figures.
 */
export const TICKER_CONTENT: Record<string, TickerContent> = {
    apple: {
        businessModel:
            'Apple designs premium consumer hardware and sells it at high margins, then layers a fast-growing, high-margin Services business — the App Store, iCloud, Apple Music, advertising, and payments — on top of an installed base of over two billion active devices. Hardware drives the ecosystem; Services monetises the loyalty it creates.',
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
    },
    microsoft: {
        businessModel:
            'Microsoft earns the bulk of its profit from enterprise software and cloud infrastructure sold largely by subscription. Three segments — Productivity (Microsoft 365, LinkedIn), Intelligent Cloud (Azure, server products), and More Personal Computing (Windows, Xbox, Surface, search) — generate durable, recurring, high-margin revenue.',
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
    },
    google: {
        businessModel:
            "Alphabet generates most of its revenue from advertising — Search, YouTube, and the Google Network — monetising the world's largest base of user-intent data. Google Cloud is a growing second pillar, and 'Other Bets' such as Waymo represent long-dated optionality.",
        keyProducts: [
            'Google Search and advertising',
            'YouTube',
            'Google Cloud Platform',
            'Android and Google Play',
            'Google Workspace',
            'Waymo (autonomous driving)',
        ],
        investmentNarrative:
            "The bull case is Search's dominant economics, YouTube's scale, accelerating Google Cloud profitability, and AI assets (Gemini, DeepMind, custom TPUs) that few rivals can match. The stock has historically traded at a discount to other mega-cap peers.\n\nThe bear case is that generative-AI answer engines could disrupt the traditional search-ad model Alphabet depends on, alongside serious antitrust exposure — including US rulings that could reshape its distribution deals and ad-tech business.",
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
    },
    amazon: {
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
        competitors: ['Microsoft (Azure)', 'Alphabet (Google)', 'Walmart', 'Alibaba', 'Shopify'],
        relatedArticleSlugs: [
            'how-to-analyze-cash-flow',
            'understanding-competitive-moats',
            'what-is-ebitda',
        ],
    },
    nvidia: {
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
    },
    meta: {
        businessModel:
            "Meta earns almost all of its revenue from advertising across Facebook, Instagram, WhatsApp, and Messenger — its 'Family of Apps' reaching billions of daily users. It reinvests heavily in AI (for ad targeting and content recommendation) and in Reality Labs, its long-term metaverse and AR / VR bet.",
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
    },
    tesla: {
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
            'Bulls value Tesla as more than an automaker — betting on autonomy (robotaxi), energy-storage growth, manufacturing scale, and AI / robotics optionality that could justify a software-like valuation.\n\nBears note that Tesla is valued far above traditional automakers while facing slowing delivery growth, price cuts that compress automotive margins, intensifying EV competition (especially from China), and a valuation heavily dependent on FSD / robotaxi promises that remain unproven at scale.',
        keyRisks: [
            'Automotive margin compression from price cuts',
            'Intensifying EV competition, notably from Chinese makers',
            'Valuation dependent on unproven autonomy / robotaxi outcomes',
            'Key-person and governance risk tied to its CEO',
        ],
        whatToWatch:
            'Watch vehicle delivery growth and automotive gross margin (excluding regulatory credits), energy-storage deployments, FSD / robotaxi progress and regulatory approvals, and average selling prices versus incentives.',
        competitors: ['BYD', 'Legacy automakers (GM, Ford, Volkswagen, Toyota)', 'Rivian', 'Lucid'],
        relatedArticleSlugs: [
            'how-to-assess-stock-risk',
            'what-is-pe-ratio',
            'behavioral-biases-investing',
        ],
    },
    netflix: {
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
    },
    amd: {
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
    },
    jpmorgan: {
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
            'Bulls view JPMorgan as the best-run large US bank — diversified, well-capitalised, and a share-gainer through cycles — with strong returns on tangible equity and disciplined risk management.\n\nBears note that bank earnings are cyclical and rate-sensitive: net interest income can compress as rates fall, credit losses rise in downturns, and tighter capital rules can limit buybacks. Banks are also macro-exposed and hard to value at a premium.',
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
    },
    visa: {
        businessModel:
            'Visa operates a global payments network that connects banks, merchants, and cardholders, earning fees on the volume and number of transactions that flow across its rails. It does not lend or take credit risk — it is a high-margin toll-taker on the secular shift from cash to digital payments.',
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
        relatedArticleSlugs: ['understanding-competitive-moats', 'roe-vs-roic', 'what-is-pe-ratio'],
    },
    disney: {
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
        competitors: ['Netflix', 'Warner Bros. Discovery', 'Comcast (NBCUniversal)', 'Paramount'],
        relatedArticleSlugs: [
            'how-to-analyze-cash-flow',
            'understanding-competitive-moats',
            'how-to-assess-stock-risk',
        ],
    },
    'coca-cola': {
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
    },
    walmart: {
        businessModel:
            "Walmart is the world's largest retailer, using enormous scale and purchasing power to offer low prices across groceries and general merchandise. It increasingly monetises higher-margin streams — e-commerce, a third-party marketplace, advertising (Walmart Connect), and membership (Walmart+) — on top of the low-margin retail base.",
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
    },
    'johnson-and-johnson': {
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
    },
}
