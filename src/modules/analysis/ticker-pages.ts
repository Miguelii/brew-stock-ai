/* eslint-disable max-lines -- static file intentional exception */
import type { TickerContent, TickerPage } from '@/types/TickerPage'
import { TICKER_CONTENT } from '@/modules/analysis/ticker-content'

const TICKER_PAGES_BASE: TickerPage[] = [
    // Technology
    {
        ticker: 'AAPL',
        name: 'Apple',
        slug: 'apple',
        sector: 'Technology',
        description:
            'Apple Inc. designs and sells consumer electronics, software, and online services. Known for the iPhone, Mac, iPad, and a growing services ecosystem.',
    },
    {
        ticker: 'MSFT',
        name: 'Microsoft',
        slug: 'microsoft',
        sector: 'Technology',
        description:
            'Microsoft Corporation develops software, cloud services, and devices. Azure, Office 365, and LinkedIn are among its flagship products.',
    },
    {
        ticker: 'GOOGL',
        name: 'Alphabet',
        slug: 'google',
        sector: 'Technology',
        description:
            "Alphabet Inc. is the parent company of Google, the world's leading search engine, alongside YouTube, Google Cloud, and Waymo.",
    },
    {
        ticker: 'AMZN',
        name: 'Amazon',
        slug: 'amazon',
        sector: 'Consumer Discretionary',
        description:
            "Amazon.com operates the world's largest e-commerce marketplace and AWS, the leading cloud computing platform.",
    },
    {
        ticker: 'TSLA',
        name: 'Tesla',
        slug: 'tesla',
        sector: 'Consumer Discretionary',
        description:
            'Tesla Inc. designs and manufactures electric vehicles, energy storage systems, and solar products. A leader in EV adoption globally.',
    },
    {
        ticker: 'NVDA',
        name: 'NVIDIA',
        slug: 'nvidia',
        sector: 'Technology',
        description:
            'NVIDIA Corporation designs GPUs and system-on-chip units. Dominant in AI training hardware, data centres, and gaming graphics.',
    },
    {
        ticker: 'META',
        name: 'Meta',
        slug: 'meta',
        sector: 'Technology',
        description:
            'Meta Platforms operates Facebook, Instagram, and WhatsApp, reaching over 3 billion daily active users. Expanding into AI and the metaverse.',
    },
    {
        ticker: 'NFLX',
        name: 'Netflix',
        slug: 'netflix',
        sector: 'Communication Services',
        description:
            "Netflix is the world's largest subscription streaming service with over 260 million paid subscribers across 190 countries.",
    },
    {
        ticker: 'AMD',
        name: 'AMD',
        slug: 'amd',
        sector: 'Technology',
        description:
            'Advanced Micro Devices designs CPUs and GPUs for PCs, data centres, and gaming consoles. A strong competitor to Intel and NVIDIA.',
    },
    {
        ticker: 'JPM',
        name: 'JPMorgan Chase',
        slug: 'jpmorgan',
        sector: 'Financials',
        description:
            'JPMorgan Chase is the largest US bank by assets, offering investment banking, consumer banking, financial services, and asset management.',
    },
    {
        ticker: 'V',
        name: 'Visa',
        slug: 'visa',
        sector: 'Financials',
        description:
            "Visa Inc. operates the world's largest retail electronic payments network, processing billions of transactions annually across 200+ countries.",
    },
    {
        ticker: 'PLTR',
        name: 'Palantir',
        slug: 'palantir',
        sector: 'Technology',
        description:
            'Palantir Technologies builds data analytics and AI platforms for government agencies and large enterprises worldwide.',
    },
    {
        ticker: 'SPOT',
        name: 'Spotify',
        slug: 'spotify',
        sector: 'Communication Services',
        description:
            "Spotify Technology is the world's most popular audio streaming platform with over 600 million monthly active users and 240 million paying subscribers.",
    },
    {
        ticker: 'COIN',
        name: 'Coinbase',
        slug: 'coinbase',
        sector: 'Financials',
        description:
            'Coinbase Global is the largest US cryptocurrency exchange, providing trading, custody, and institutional services for digital assets.',
    },
    {
        ticker: 'DIS',
        name: 'Disney',
        slug: 'disney',
        sector: 'Communication Services',
        description:
            'The Walt Disney Company is a diversified entertainment conglomerate with theme parks, studios, streaming (Disney+), and broadcast networks.',
    },
    {
        ticker: 'BABA',
        name: 'Alibaba',
        slug: 'alibaba',
        sector: 'Consumer Discretionary',
        description:
            "Alibaba Group operates China's largest e-commerce and cloud computing platforms, including Taobao, Tmall, and Alibaba Cloud.",
    },
    {
        ticker: 'INTC',
        name: 'Intel',
        slug: 'intel',
        sector: 'Technology',
        description:
            'Intel Corporation designs and manufactures semiconductors, microprocessors, and integrated circuits used in PCs, servers, and data centres.',
    },
    {
        ticker: 'PYPL',
        name: 'PayPal',
        slug: 'paypal',
        sector: 'Financials',
        description:
            'PayPal Holdings operates a digital payments platform with over 400 million active accounts, including Venmo and Braintree.',
    },
    {
        ticker: 'WMT',
        name: 'Walmart',
        slug: 'walmart',
        sector: 'Consumer Staples',
        description:
            "Walmart is the world's largest retailer by revenue, operating thousands of stores globally and a fast-growing e-commerce business.",
    },
    {
        ticker: 'BA',
        name: 'Boeing',
        slug: 'boeing',
        sector: 'Industrials',
        description:
            "Boeing is the world's largest aerospace manufacturer, producing commercial jetliners, military aircraft, and space systems.",
    },
    // Additional Technology
    {
        ticker: 'CRM',
        name: 'Salesforce',
        slug: 'salesforce',
        sector: 'Technology',
        description:
            'Salesforce Inc. is the global leader in cloud-based CRM software, offering sales, marketing, analytics, and AI platforms to enterprises worldwide.',
    },
    {
        ticker: 'ORCL',
        name: 'Oracle',
        slug: 'oracle',
        sector: 'Technology',
        description:
            'Oracle Corporation provides database software, cloud infrastructure, and enterprise applications to businesses worldwide. A cornerstone of enterprise IT.',
    },
    {
        ticker: 'ADBE',
        name: 'Adobe',
        slug: 'adobe',
        sector: 'Technology',
        description:
            'Adobe Inc. provides creative, marketing, and document management software. Known for Photoshop, Illustrator, Acrobat, and the Experience Cloud platform.',
    },
    {
        ticker: 'NOW',
        name: 'ServiceNow',
        slug: 'servicenow',
        sector: 'Technology',
        description:
            'ServiceNow provides cloud-based IT service management and workflow automation platforms, helping enterprises digitise and automate business processes.',
    },
    {
        ticker: 'SNOW',
        name: 'Snowflake',
        slug: 'snowflake',
        sector: 'Technology',
        description:
            'Snowflake Inc. provides a cloud-based data warehousing platform that enables organisations to store, share, and analyse large-scale data workloads.',
    },
    {
        ticker: 'UBER',
        name: 'Uber',
        slug: 'uber',
        sector: 'Technology',
        description:
            'Uber Technologies operates a global ride-hailing, food delivery (Uber Eats), and freight logistics platform across 70+ countries.',
    },
    {
        ticker: 'LYFT',
        name: 'Lyft',
        slug: 'lyft',
        sector: 'Technology',
        description:
            'Lyft Inc. operates a ride-hailing platform primarily in North America, competing with Uber and expanding into bikes, scooters, and autonomous vehicles.',
    },
    {
        ticker: 'SNAP',
        name: 'Snap',
        slug: 'snap',
        sector: 'Technology',
        description:
            'Snap Inc. operates Snapchat, a multimedia messaging app popular with younger demographics, monetised through advertising and augmented reality features.',
    },
    {
        ticker: 'TWLO',
        name: 'Twilio',
        slug: 'twilio',
        sector: 'Technology',
        description:
            'Twilio Inc. provides cloud communications APIs that let developers embed messaging, voice, and video into applications. A backbone of modern customer engagement.',
    },
    {
        ticker: 'DDOG',
        name: 'Datadog',
        slug: 'datadog',
        sector: 'Technology',
        description:
            'Datadog Inc. offers a cloud-based monitoring and analytics platform for developers and IT teams, providing observability across infrastructure, applications, and logs.',
    },
    {
        ticker: 'NET',
        name: 'Cloudflare',
        slug: 'cloudflare',
        sector: 'Technology',
        description:
            'Cloudflare Inc. provides cloud-based network security, performance, and reliability services. A critical infrastructure layer for millions of websites globally.',
    },
    {
        ticker: 'ZS',
        name: 'Zscaler',
        slug: 'zscaler',
        sector: 'Technology',
        description:
            'Zscaler Inc. delivers cloud-native cybersecurity solutions through its Zero Trust Exchange platform, enabling secure access for users, devices, and workloads.',
    },
    {
        ticker: 'CRWD',
        name: 'CrowdStrike',
        slug: 'crowdstrike',
        sector: 'Technology',
        description:
            'CrowdStrike Holdings provides cloud-delivered endpoint security, threat intelligence, and cyberattack response services used by enterprises and governments worldwide.',
    },
    {
        ticker: 'PANW',
        name: 'Palo Alto Networks',
        slug: 'palo-alto-networks',
        sector: 'Technology',
        description:
            'Palo Alto Networks offers network security, cloud security, and AI-driven security operations platforms used by enterprises in over 150 countries.',
    },
    {
        ticker: 'OKTA',
        name: 'Okta',
        slug: 'okta',
        sector: 'Technology',
        description:
            'Okta Inc. provides identity and access management solutions that enable secure user authentication and zero-trust security for organisations of all sizes.',
    },
    {
        ticker: 'MDB',
        name: 'MongoDB',
        slug: 'mongodb',
        sector: 'Technology',
        description:
            'MongoDB Inc. provides a general-purpose NoSQL database platform and developer tools. Its Atlas cloud offering is the backbone of many modern applications.',
    },
    {
        ticker: 'TTD',
        name: 'The Trade Desk',
        slug: 'trade-desk',
        sector: 'Technology',
        description:
            'The Trade Desk operates a self-service programmatic advertising platform that helps buyers of digital advertising manage data-driven campaigns across channels.',
    },
    {
        ticker: 'RBLX',
        name: 'Roblox',
        slug: 'roblox',
        sector: 'Technology',
        description:
            'Roblox Corporation operates a global online entertainment platform and game creation system, with hundreds of millions of monthly active users, primarily Gen Z.',
    },
    {
        ticker: 'U',
        name: 'Unity Software',
        slug: 'unity',
        sector: 'Technology',
        description:
            'Unity Software provides a real-time 3D development platform used to create games, simulations, and interactive experiences across mobile, console, and XR.',
    },
    {
        ticker: 'PATH',
        name: 'UiPath',
        slug: 'uipath',
        sector: 'Technology',
        description:
            'UiPath Inc. provides enterprise robotic process automation (RPA) software that automates repetitive business tasks across finance, HR, and operations.',
    },
    {
        ticker: 'AI',
        name: 'C3.ai',
        slug: 'c3ai',
        sector: 'Technology',
        description:
            'C3.ai provides enterprise AI software applications for digital transformation, serving industries including energy, financial services, and defence.',
    },
    {
        ticker: 'SMCI',
        name: 'Super Micro Computer',
        slug: 'supermicro',
        sector: 'Technology',
        description:
            'Super Micro Computer designs and manufactures high-performance server and storage solutions, benefiting significantly from AI infrastructure buildout.',
    },
    {
        ticker: 'ARM',
        name: 'Arm Holdings',
        slug: 'arm',
        sector: 'Technology',
        description:
            'Arm Holdings licenses CPU and GPU chip architectures used in virtually every smartphone globally, and increasingly in data centre and AI chips.',
    },
    {
        ticker: 'AVGO',
        name: 'Broadcom',
        slug: 'broadcom',
        sector: 'Technology',
        description:
            'Broadcom Inc. designs and supplies semiconductor and infrastructure software solutions. A critical supplier for data centres, networking, and broadband.',
    },
    {
        ticker: 'QCOM',
        name: 'Qualcomm',
        slug: 'qualcomm',
        sector: 'Technology',
        description:
            'Qualcomm Incorporated designs wireless technology and semiconductors, including Snapdragon chips that power billions of Android devices and automotive systems.',
    },
    {
        ticker: 'TXN',
        name: 'Texas Instruments',
        slug: 'texas-instruments',
        sector: 'Technology',
        description:
            'Texas Instruments designs and manufactures analog and embedded processing semiconductors used in industrial, automotive, and consumer electronics applications.',
    },
    {
        ticker: 'AMAT',
        name: 'Applied Materials',
        slug: 'applied-materials',
        sector: 'Technology',
        description:
            'Applied Materials provides equipment, services, and software used to fabricate semiconductor chips. A key enabler of the global semiconductor supply chain.',
    },
    {
        ticker: 'LRCX',
        name: 'Lam Research',
        slug: 'lam-research',
        sector: 'Technology',
        description:
            'Lam Research Corporation supplies wafer fabrication equipment and services to the semiconductor industry, critical to memory and logic chip manufacturing.',
    },
    {
        ticker: 'KLAC',
        name: 'KLA Corporation',
        slug: 'kla',
        sector: 'Technology',
        description:
            'KLA Corporation provides process control and yield management solutions for the semiconductor and related nanoelectronics industries.',
    },
    {
        ticker: 'ASML',
        name: 'ASML',
        slug: 'asml',
        sector: 'Technology',
        description:
            'ASML Holding is the sole manufacturer of extreme ultraviolet (EUV) lithography machines, making it indispensable to the production of advanced semiconductors.',
    },
    {
        ticker: 'TSM',
        name: 'TSMC',
        slug: 'tsmc',
        sector: 'Technology',
        description:
            "Taiwan Semiconductor Manufacturing Company is the world's largest dedicated chip foundry, producing chips for Apple, NVIDIA, AMD, and Qualcomm.",
    },
    {
        ticker: 'SHOP',
        name: 'Shopify',
        slug: 'shopify',
        sector: 'Technology',
        description:
            'Shopify Inc. provides an e-commerce platform and ecosystem of tools enabling merchants of all sizes to set up, manage, and grow online businesses.',
    },
    {
        ticker: 'SQ',
        name: 'Block',
        slug: 'block',
        sector: 'Technology',
        description:
            'Block Inc. (formerly Square) operates financial services and digital payments ecosystems including Square, Cash App, and Afterpay.',
    },
    {
        ticker: 'HOOD',
        name: 'Robinhood',
        slug: 'robinhood',
        sector: 'Financials',
        description:
            'Robinhood Markets operates a commission-free trading platform for stocks, options, ETFs, and crypto, targeting retail investors and younger demographics.',
    },
    // Financials
    {
        ticker: 'GS',
        name: 'Goldman Sachs',
        slug: 'goldman-sachs',
        sector: 'Financials',
        description:
            'Goldman Sachs Group is a leading global investment banking, securities, and investment management firm serving corporations, governments, and institutions.',
    },
    {
        ticker: 'MS',
        name: 'Morgan Stanley',
        slug: 'morgan-stanley',
        sector: 'Financials',
        description:
            'Morgan Stanley provides investment banking, wealth management, and investment management services to corporations, governments, and individuals worldwide.',
    },
    {
        ticker: 'BAC',
        name: 'Bank of America',
        slug: 'bank-of-america',
        sector: 'Financials',
        description:
            'Bank of America Corporation is one of the largest US banks, serving 68 million consumers and businesses through retail banking, wealth management, and investment banking.',
    },
    {
        ticker: 'WFC',
        name: 'Wells Fargo',
        slug: 'wells-fargo',
        sector: 'Financials',
        description:
            'Wells Fargo & Company is a diversified financial services company with $1.9 trillion in assets, offering banking, investments, mortgage, and consumer finance products.',
    },
    {
        ticker: 'C',
        name: 'Citigroup',
        slug: 'citigroup',
        sector: 'Financials',
        description:
            'Citigroup Inc. is a global bank operating in 160+ countries, providing consumer banking, corporate and investment banking, and wealth management services.',
    },
    {
        ticker: 'AXP',
        name: 'American Express',
        slug: 'american-express',
        sector: 'Financials',
        description:
            'American Express is a global financial services company best known for its charge cards, credit cards, and travel-related services targeting premium customers.',
    },
    {
        ticker: 'MA',
        name: 'Mastercard',
        slug: 'mastercard',
        sector: 'Financials',
        description:
            'Mastercard Incorporated is a global technology company in the payments industry, connecting consumers, financial institutions, merchants, and governments.',
    },
    {
        ticker: 'BLK',
        name: 'BlackRock',
        slug: 'blackrock',
        sector: 'Financials',
        description:
            "BlackRock Inc. is the world's largest asset manager with over $10 trillion in assets under management, known for iShares ETFs and the Aladdin risk platform.",
    },
    {
        ticker: 'BRK.B',
        name: 'Berkshire Hathaway',
        slug: 'berkshire-hathaway',
        sector: 'Financials',
        description:
            "Berkshire Hathaway Inc. is Warren Buffett's conglomerate holding company, owning businesses across insurance, railroads, energy, manufacturing, and retail.",
    },
    {
        ticker: 'SCHW',
        name: 'Charles Schwab',
        slug: 'charles-schwab',
        sector: 'Financials',
        description:
            'Charles Schwab Corporation provides brokerage, banking, wealth management, and custody services to retail investors and independent investment advisors.',
    },
    // Consumer & Retail
    {
        ticker: 'COST',
        name: 'Costco',
        slug: 'costco',
        sector: 'Consumer Staples',
        description:
            'Costco Wholesale Corporation operates a membership-based warehouse club chain with 870+ locations worldwide, known for bulk products and exceptional member loyalty.',
    },
    {
        ticker: 'HD',
        name: 'Home Depot',
        slug: 'home-depot',
        sector: 'Consumer Discretionary',
        description:
            "Home Depot is the world's largest home improvement retailer, operating 2,300+ stores across North America and serving DIY homeowners and professional contractors.",
    },
    {
        ticker: 'MCD',
        name: "McDonald's",
        slug: 'mcdonalds',
        sector: 'Consumer Discretionary',
        description:
            "McDonald's Corporation is the world's largest fast-food chain with 40,000+ restaurants in over 100 countries, operating primarily through a franchised business model.",
    },
    {
        ticker: 'SBUX',
        name: 'Starbucks',
        slug: 'starbucks',
        sector: 'Consumer Discretionary',
        description:
            "Starbucks Corporation is the world's largest coffeehouse chain with 35,000+ stores globally, operating through company-operated and licensed locations.",
    },
    {
        ticker: 'NKE',
        name: 'Nike',
        slug: 'nike',
        sector: 'Consumer Discretionary',
        description:
            "Nike Inc. is the world's leading athletic footwear, apparel, and equipment brand, with a global direct-to-consumer strategy and powerful innovation pipeline.",
    },
    {
        ticker: 'LULU',
        name: 'Lululemon',
        slug: 'lululemon',
        sector: 'Consumer Discretionary',
        description:
            'Lululemon Athletica is a premium athletic apparel brand known for yoga wear, with a loyal community-driven customer base and fast-growing international presence.',
    },
    {
        ticker: 'TGT',
        name: 'Target',
        slug: 'target',
        sector: 'Consumer Discretionary',
        description:
            'Target Corporation is a US retail chain offering general merchandise through 2,000+ stores and a growing digital commerce platform.',
    },
    {
        ticker: 'AMGN',
        name: 'Amgen',
        slug: 'amgen',
        sector: 'Healthcare',
        description:
            'Amgen Inc. is a leading biotechnology company focused on human therapeutics, with blockbuster drugs in oncology, cardiovascular disease, and inflammation.',
    },
    {
        ticker: 'LOW',
        name: "Lowe's",
        slug: 'lowes',
        sector: 'Consumer Discretionary',
        description:
            "Lowe's Companies is the second-largest US home improvement retailer, with 1,700+ stores serving DIY customers and professional contractors.",
    },
    // Healthcare & Biotech
    {
        ticker: 'JNJ',
        name: 'Johnson & Johnson',
        slug: 'johnson-and-johnson',
        sector: 'Healthcare',
        description:
            'Johnson & Johnson is a diversified healthcare company with leading businesses in pharmaceuticals, medical devices, and consumer health products.',
    },
    {
        ticker: 'UNH',
        name: 'UnitedHealth Group',
        slug: 'unitedhealth',
        sector: 'Healthcare',
        description:
            'UnitedHealth Group is the largest US health insurer, operating through UnitedHealthcare (insurance) and Optum (health services and technology).',
    },
    {
        ticker: 'LLY',
        name: 'Eli Lilly',
        slug: 'eli-lilly',
        sector: 'Healthcare',
        description:
            'Eli Lilly and Company develops pharmaceutical products in diabetes, oncology, immunology, and neurology. Its GLP-1 drugs Mounjaro and Zepbound have seen explosive growth.',
    },
    {
        ticker: 'PFE',
        name: 'Pfizer',
        slug: 'pfizer',
        sector: 'Healthcare',
        description:
            'Pfizer Inc. is a global biopharmaceutical company known for COVID-19 vaccines, oncology, and rare disease treatments, operating across all major therapeutic areas.',
    },
    {
        ticker: 'MRNA',
        name: 'Moderna',
        slug: 'moderna',
        sector: 'Healthcare',
        description:
            'Moderna Inc. is a biotechnology company that pioneered mRNA therapeutics, known for its COVID-19 vaccine and a pipeline spanning infectious diseases and oncology.',
    },
    {
        ticker: 'ABBV',
        name: 'AbbVie',
        slug: 'abbvie',
        sector: 'Healthcare',
        description:
            'AbbVie Inc. is a biopharmaceutical company focused on immunology, oncology, and neuroscience. Humira and Skyrizi are among its best-selling drugs.',
    },
    {
        ticker: 'MRK',
        name: 'Merck',
        slug: 'merck',
        sector: 'Healthcare',
        description:
            'Merck & Co. is a global pharmaceutical leader with major franchises in oncology (Keytruda), vaccines, and infectious diseases.',
    },
    {
        ticker: 'BMY',
        name: 'Bristol-Myers Squibb',
        slug: 'bristol-myers-squibb',
        sector: 'Healthcare',
        description:
            'Bristol-Myers Squibb is a global biopharmaceutical company focused on oncology, hematology, immunology, and cardiovascular disease.',
    },
    {
        ticker: 'GILD',
        name: 'Gilead Sciences',
        slug: 'gilead',
        sector: 'Healthcare',
        description:
            'Gilead Sciences Inc. develops innovative medicines in HIV, liver disease, haematology/oncology, and inflammation.',
    },
    {
        ticker: 'ISRG',
        name: 'Intuitive Surgical',
        slug: 'intuitive-surgical',
        sector: 'Healthcare',
        description:
            'Intuitive Surgical designs and manufactures the da Vinci robotic surgical system, the global leader in minimally invasive robotic surgery.',
    },
    {
        ticker: 'DXCM',
        name: 'DexCom',
        slug: 'dexcom',
        sector: 'Healthcare',
        description:
            'DexCom Inc. develops continuous glucose monitoring (CGM) systems for people with diabetes, with strong growth from expanding international markets and direct-to-consumer sales.',
    },
    {
        ticker: 'INTU',
        name: 'Intuit',
        slug: 'intuit',
        sector: 'Technology',
        description:
            'Intuit Inc. provides financial management software including TurboTax, QuickBooks, Credit Karma, and Mailchimp, serving consumers and small businesses.',
    },
    // Energy
    {
        ticker: 'XOM',
        name: 'ExxonMobil',
        slug: 'exxonmobil',
        sector: 'Energy',
        description:
            "ExxonMobil Corporation is one of the world's largest publicly traded oil and gas companies, with upstream, downstream, and chemical operations globally.",
    },
    {
        ticker: 'CVX',
        name: 'Chevron',
        slug: 'chevron',
        sector: 'Energy',
        description:
            "Chevron Corporation is a global integrated energy company operating in oil, natural gas, and renewable energy, ranking among the world's largest corporations.",
    },
    {
        ticker: 'COP',
        name: 'ConocoPhillips',
        slug: 'conocophillips',
        sector: 'Energy',
        description:
            "ConocoPhillips is one of the world's largest independent oil and gas exploration and production companies, with major assets in the US, Norway, and Asia Pacific.",
    },
    {
        ticker: 'SLB',
        name: 'SLB',
        slug: 'slb',
        sector: 'Energy',
        description:
            "SLB (formerly Schlumberger) is the world's leading oilfield services company, providing technology, information, and integrated project management services.",
    },
    {
        ticker: 'OXY',
        name: 'Occidental Petroleum',
        slug: 'occidental',
        sector: 'Energy',
        description:
            'Occidental Petroleum is an international oil and gas company with operations in the US, Middle East, and Latin America, partially owned by Berkshire Hathaway.',
    },
    {
        ticker: 'NEE',
        name: 'NextEra Energy',
        slug: 'nextera-energy',
        sector: 'Utilities',
        description:
            "NextEra Energy is the world's largest producer of renewable energy from wind and solar, while also operating one of the largest regulated electric utilities in the US.",
    },
    {
        ticker: 'ENPH',
        name: 'Enphase Energy',
        slug: 'enphase',
        sector: 'Energy',
        description:
            'Enphase Energy designs and manufactures microinverter-based solar and storage systems for residential and commercial customers globally.',
    },
    // Industrials
    {
        ticker: 'CAT',
        name: 'Caterpillar',
        slug: 'caterpillar',
        sector: 'Industrials',
        description:
            "Caterpillar Inc. is the world's leading manufacturer of construction and mining equipment, diesel and natural gas engines, and industrial gas turbines.",
    },
    {
        ticker: 'DE',
        name: 'Deere & Company',
        slug: 'deere',
        sector: 'Industrials',
        description:
            "Deere & Company manufactures agricultural, construction, and forestry machinery under the John Deere brand, the world's largest farm equipment maker.",
    },
    {
        ticker: 'GE',
        name: 'GE Aerospace',
        slug: 'ge-aerospace',
        sector: 'Industrials',
        description:
            'GE Aerospace (formerly General Electric) is a leading designer and manufacturer of jet engines and aviation systems for commercial and military aircraft.',
    },
    {
        ticker: 'HON',
        name: 'Honeywell',
        slug: 'honeywell',
        sector: 'Industrials',
        description:
            'Honeywell International is a diversified technology and manufacturing conglomerate operating in aerospace, building technologies, performance materials, and safety.',
    },
    {
        ticker: 'RTX',
        name: 'RTX Corporation',
        slug: 'rtx',
        sector: 'Industrials',
        description:
            'RTX Corporation (formerly Raytheon Technologies) is a global defence and aerospace manufacturer, producing jet engines (Pratt & Whitney), missiles, and radar systems.',
    },
    {
        ticker: 'LMT',
        name: 'Lockheed Martin',
        slug: 'lockheed-martin',
        sector: 'Industrials',
        description:
            "Lockheed Martin is the world's largest defence contractor, producing fighter jets (F-35), missiles, space systems, and advanced technology for governments.",
    },
    {
        ticker: 'NOC',
        name: 'Northrop Grumman',
        slug: 'northrop-grumman',
        sector: 'Industrials',
        description:
            'Northrop Grumman is a global defence and aerospace company specialising in autonomous systems, cyber, C4ISR, and strike technologies for the US and allied governments.',
    },
    {
        ticker: 'UPS',
        name: 'UPS',
        slug: 'ups',
        sector: 'Industrials',
        description:
            "United Parcel Service is the world's largest package delivery company and a leading provider of supply chain management solutions.",
    },
    {
        ticker: 'FDX',
        name: 'FedEx',
        slug: 'fedex',
        sector: 'Industrials',
        description:
            'FedEx Corporation provides transportation, e-commerce, and business services globally through FedEx Express, FedEx Ground, and FedEx Freight.',
    },
    // Communication Services
    {
        ticker: 'T',
        name: 'AT&T',
        slug: 'att',
        sector: 'Communication Services',
        description:
            'AT&T Inc. is the largest US wireless carrier and a major provider of broadband and pay-TV services through DirecTV.',
    },
    {
        ticker: 'VZ',
        name: 'Verizon',
        slug: 'verizon',
        sector: 'Communication Services',
        description:
            'Verizon Communications is a leading US telecommunications company offering wireless, broadband, and business communications services to consumers and enterprises.',
    },
    {
        ticker: 'TMUS',
        name: 'T-Mobile',
        slug: 't-mobile',
        sector: 'Communication Services',
        description:
            'T-Mobile US is the second-largest US wireless carrier, known for its disruptive "Un-carrier" strategy and accelerated 5G network build-out.',
    },
    {
        ticker: 'CMCSA',
        name: 'Comcast',
        slug: 'comcast',
        sector: 'Communication Services',
        description:
            'Comcast Corporation is the largest US cable operator and home internet provider, also owning NBCUniversal studios and theme parks.',
    },
    {
        ticker: 'CHTR',
        name: 'Charter Communications',
        slug: 'charter',
        sector: 'Communication Services',
        description:
            'Charter Communications is the second-largest US cable company, operating the Spectrum brand for residential and business internet, TV, and phone services.',
    },
    // Consumer Staples
    {
        ticker: 'KO',
        name: 'Coca-Cola',
        slug: 'coca-cola',
        sector: 'Consumer Staples',
        description:
            "The Coca-Cola Company is the world's largest beverage company, with 200+ brands sold in 200+ countries. Known for its iconic brand and high dividend consistency.",
    },
    {
        ticker: 'PEP',
        name: 'PepsiCo',
        slug: 'pepsico',
        sector: 'Consumer Staples',
        description:
            "PepsiCo Inc. is a global food and beverage giant owning brands like Pepsi, Lay's, Gatorade, Quaker, and Tropicana across 200 countries.",
    },
    {
        ticker: 'PG',
        name: 'Procter & Gamble',
        slug: 'procter-and-gamble',
        sector: 'Consumer Staples',
        description:
            'Procter & Gamble Company sells consumer goods across 180+ countries under brands like Tide, Pampers, Gillette, Oral-B, and Head & Shoulders.',
    },
    {
        ticker: 'PM',
        name: 'Philip Morris',
        slug: 'philip-morris',
        sector: 'Consumer Staples',
        description:
            'Philip Morris International is a global tobacco company transitioning to smoke-free products, with IQOS being its flagship heated tobacco product.',
    },
    {
        ticker: 'MO',
        name: 'Altria',
        slug: 'altria',
        sector: 'Consumer Staples',
        description:
            'Altria Group manufactures and markets cigarettes, smokeless tobacco, and oral nicotine products primarily in the United States, known for its high dividend yield.',
    },
    {
        ticker: 'MDLZ',
        name: 'Mondelez',
        slug: 'mondelez',
        sector: 'Consumer Staples',
        description:
            'Mondelez International is a global snacking company owning brands like Oreo, Cadbury, Toblerone, and Ritz, sold in 150+ countries.',
    },
    {
        ticker: 'CL',
        name: 'Colgate-Palmolive',
        slug: 'colgate',
        sector: 'Consumer Staples',
        description:
            'Colgate-Palmolive Company produces and distributes consumer products including oral care, personal care, home care, and pet nutrition brands globally.',
    },
    // Real Estate
    {
        ticker: 'AMT',
        name: 'American Tower',
        slug: 'american-tower',
        sector: 'Real Estate',
        description:
            'American Tower Corporation is a global REIT that owns and operates wireless and broadcast communications infrastructure across 22 countries.',
    },
    {
        ticker: 'PLD',
        name: 'Prologis',
        slug: 'prologis',
        sector: 'Real Estate',
        description:
            "Prologis Inc. is the world's largest industrial REIT, owning logistics and distribution facilities in key markets across 19 countries.",
    },
    {
        ticker: 'EQIX',
        name: 'Equinix',
        slug: 'equinix',
        sector: 'Real Estate',
        description:
            "Equinix Inc. is the world's largest data centre REIT, operating 240+ International Business Exchange (IBX) facilities across 33 countries.",
    },
    {
        ticker: 'WELL',
        name: 'Welltower',
        slug: 'welltower',
        sector: 'Real Estate',
        description:
            'Welltower Inc. is a leading healthcare REIT investing in senior housing, post-acute communities, and outpatient medical properties across North America and the UK.',
    },
    // Materials & Mining
    {
        ticker: 'NEM',
        name: 'Newmont',
        slug: 'newmont',
        sector: 'Materials',
        description:
            "Newmont Corporation is the world's largest gold mining company, with operations in North and South America, Australia, and Africa.",
    },
    {
        ticker: 'FCX',
        name: 'Freeport-McMoRan',
        slug: 'freeport-mcmoran',
        sector: 'Materials',
        description:
            'Freeport-McMoRan is one of the largest copper producers in the world, with major mining operations in the Americas and Indonesia. A key beneficiary of the energy transition.',
    },
    {
        ticker: 'LIN',
        name: 'Linde',
        slug: 'linde',
        sector: 'Materials',
        description:
            "Linde plc is the world's largest industrial gas company, supplying oxygen, nitrogen, hydrogen, and helium to healthcare, manufacturing, and energy industries.",
    },
    // Crypto & Alternative Assets
    {
        ticker: 'MSTR',
        name: 'MicroStrategy',
        slug: 'microstrategy',
        sector: 'Technology',
        description:
            'MicroStrategy (now Strategy) has become the largest corporate holder of Bitcoin, pursuing a Bitcoin treasury strategy while operating a business intelligence software division.',
    },
    {
        ticker: 'MARA',
        name: 'MARA Holdings',
        slug: 'mara',
        sector: 'Technology',
        description:
            'MARA Holdings (formerly Marathon Digital) is one of the largest Bitcoin mining companies, operating large-scale digital asset mining infrastructure.',
    },
    {
        ticker: 'RIOT',
        name: 'Riot Platforms',
        slug: 'riot-platforms',
        sector: 'Technology',
        description:
            'Riot Platforms Inc. is a major US Bitcoin mining company with facilities in Texas, focused on large-scale, low-cost Bitcoin production.',
    },
    // Automotive
    {
        ticker: 'F',
        name: 'Ford Motor',
        slug: 'ford',
        sector: 'Consumer Discretionary',
        description:
            'Ford Motor Company designs, manufactures, and sells vehicles globally, with a growing EV division (Ford Model e) and a profitable commercial vehicle segment (Ford Pro).',
    },
    {
        ticker: 'GM',
        name: 'General Motors',
        slug: 'general-motors',
        sector: 'Consumer Discretionary',
        description:
            "General Motors Company is one of the world's largest automakers, with brands including Chevrolet, GMC, Cadillac, and Buick, and a growing EV portfolio.",
    },
    {
        ticker: 'RIVN',
        name: 'Rivian',
        slug: 'rivian',
        sector: 'Consumer Discretionary',
        description:
            'Rivian Automotive is an electric vehicle manufacturer focused on trucks and SUVs, with the R1T pickup, R1S SUV, and commercial delivery vans for Amazon.',
    },
    {
        ticker: 'LCID',
        name: 'Lucid Group',
        slug: 'lucid',
        sector: 'Consumer Discretionary',
        description:
            'Lucid Group Inc. designs and manufactures premium electric vehicles led by the Lucid Air, targeting the luxury EV segment with superior range technology.',
    },
    // Travel & Hospitality
    {
        ticker: 'MAR',
        name: 'Marriott International',
        slug: 'marriott',
        sector: 'Consumer Discretionary',
        description:
            "Marriott International is the world's largest hotel company, with 30 brands and 8,700+ properties across 139 countries, including Sheraton, W Hotels, and Ritz-Carlton.",
    },
    {
        ticker: 'HLT',
        name: 'Hilton',
        slug: 'hilton',
        sector: 'Consumer Discretionary',
        description:
            'Hilton Worldwide Holdings operates 22 hotel brands with 7,500+ properties globally, from economy to luxury, through a capital-light franchise model.',
    },
    {
        ticker: 'DAL',
        name: 'Delta Air Lines',
        slug: 'delta',
        sector: 'Industrials',
        description:
            "Delta Air Lines is one of the world's largest airlines, operating a global network of flights and known for premium customer service and operational reliability.",
    },
    {
        ticker: 'AAL',
        name: 'American Airlines',
        slug: 'american-airlines',
        sector: 'Industrials',
        description:
            "American Airlines Group is the world's largest airline by fleet size, operating domestic and international routes and managing the AAdvantage loyalty program.",
    },
    {
        ticker: 'UAL',
        name: 'United Airlines',
        slug: 'united-airlines',
        sector: 'Industrials',
        description:
            'United Airlines Holdings is a major US carrier with a vast global network, hub operations in Chicago, New York, Houston, Los Angeles, and San Francisco.',
    },
    {
        ticker: 'BKNG',
        name: 'Booking Holdings',
        slug: 'booking-holdings',
        sector: 'Consumer Discretionary',
        description:
            "Booking Holdings operates the world's largest online travel companies including Booking.com, Priceline, Kayak, and Agoda.",
    },
    {
        ticker: 'ABNB',
        name: 'Airbnb',
        slug: 'airbnb',
        sector: 'Consumer Discretionary',
        description:
            'Airbnb Inc. operates a global short-term rental and experiences marketplace, connecting hosts and guests across 220+ countries and 100,000+ cities.',
    },
    // SaaS & Cloud
    {
        ticker: 'HUBS',
        name: 'HubSpot',
        slug: 'hubspot',
        sector: 'Technology',
        description:
            'HubSpot Inc. provides an all-in-one CRM platform for marketing, sales, and customer service, targeting small and mid-market businesses globally.',
    },
    {
        ticker: 'ZM',
        name: 'Zoom Video',
        slug: 'zoom',
        sector: 'Technology',
        description:
            'Zoom Video Communications provides a cloud-based video conferencing, phone, and collaboration platform used by enterprises and individuals worldwide.',
    },
    {
        ticker: 'DOCU',
        name: 'DocuSign',
        slug: 'docusign',
        sector: 'Technology',
        description:
            'DocuSign Inc. is the global standard for e-signatures and digital agreement management, used by hundreds of thousands of businesses to automate contract workflows.',
    },
    {
        ticker: 'WDAY',
        name: 'Workday',
        slug: 'workday',
        sector: 'Technology',
        description:
            'Workday Inc. provides enterprise cloud applications for human resources, finance, and planning, serving large organisations across healthcare, education, and financial services.',
    },
    {
        ticker: 'VEEV',
        name: 'Veeva Systems',
        slug: 'veeva',
        sector: 'Technology',
        description:
            'Veeva Systems provides cloud-based software for the global life sciences industry, covering clinical, regulatory, quality, and commercial operations.',
    },
    {
        ticker: 'TEAM',
        name: 'Atlassian',
        slug: 'atlassian',
        sector: 'Technology',
        description:
            'Atlassian Corporation provides software collaboration tools including Jira, Confluence, and Trello, used by millions of software development teams worldwide.',
    },
    // Emerging & High-Growth
    {
        ticker: 'APP',
        name: 'AppLovin',
        slug: 'applovin',
        sector: 'Technology',
        description:
            'AppLovin Corporation provides a software platform and technology solutions for mobile app marketing and monetisation, with rapid growth from its AXON AI engine.',
    },
    {
        ticker: 'CELH',
        name: 'Celsius Holdings',
        slug: 'celsius',
        sector: 'Consumer Staples',
        description:
            'Celsius Holdings manufactures and markets functional energy drinks positioned as fitness beverages, with rapid market share gains in the US and international expansion.',
    },
    {
        ticker: 'SOUN',
        name: 'SoundHound AI',
        slug: 'soundhound',
        sector: 'Technology',
        description:
            'SoundHound AI provides voice AI and conversational intelligence solutions for restaurants, automotive, and enterprise customers.',
    },
    {
        ticker: 'IONQ',
        name: 'IonQ',
        slug: 'ionq',
        sector: 'Technology',
        description:
            'IonQ Inc. develops and commercialises quantum computers, targeting pharmaceutical, financial, and logistics applications with trapped-ion quantum technology.',
    },
    {
        ticker: 'RGTI',
        name: 'Rigetti Computing',
        slug: 'rigetti',
        sector: 'Technology',
        description:
            'Rigetti Computing Inc. builds superconducting quantum computers and offers access through cloud platforms, with applications in optimisation and simulation.',
    },
    {
        ticker: 'NKLA',
        name: 'Nikola',
        slug: 'nikola',
        sector: 'Industrials',
        description:
            'Nikola Corporation designs hydrogen fuel cell and battery-electric heavy-duty trucks, targeting long-haul commercial freight with zero-emission technology.',
    },
    {
        ticker: 'SOFI',
        name: 'SoFi Technologies',
        slug: 'sofi',
        sector: 'Financials',
        description:
            'SoFi Technologies is a digital personal finance platform offering student loan refinancing, mortgages, personal loans, investing, and banking services.',
    },
    {
        ticker: 'AFRM',
        name: 'Affirm',
        slug: 'affirm',
        sector: 'Financials',
        description:
            'Affirm Holdings provides buy-now-pay-later (BNPL) financing solutions, partnering with merchants to offer flexible payment options at the point of sale.',
    },
    {
        ticker: 'UPST',
        name: 'Upstart',
        slug: 'upstart',
        sector: 'Financials',
        description:
            'Upstart Holdings operates an AI-powered lending marketplace that partners with banks and credit unions to offer personal loans using alternative credit models.',
    },
    {
        ticker: 'OPEN',
        name: 'Opendoor',
        slug: 'opendoor',
        sector: 'Real Estate',
        description:
            'Opendoor Technologies is a digital real estate marketplace that enables homeowners to sell instantly and buyers to purchase homes online.',
    },
    {
        ticker: 'DASH',
        name: 'DoorDash',
        slug: 'doordash',
        sector: 'Consumer Discretionary',
        description:
            'DoorDash Inc. is the largest US food delivery platform, connecting consumers with local restaurants, grocery stores, and convenience retailers.',
    },
    {
        ticker: 'PINS',
        name: 'Pinterest',
        slug: 'pinterest',
        sector: 'Technology',
        description:
            'Pinterest Inc. operates a visual discovery and inspiration platform with over 480 million monthly active users, monetised primarily through shopping-intent advertising.',
    },
    {
        ticker: 'MTCH',
        name: 'Match Group',
        slug: 'match-group',
        sector: 'Technology',
        description:
            'Match Group operates a portfolio of online dating apps including Tinder, Hinge, OkCupid, and Match.com, serving millions of users globally.',
    },
    {
        ticker: 'DUOL',
        name: 'Duolingo',
        slug: 'duolingo',
        sector: 'Technology',
        description:
            "Duolingo Inc. operates the world's most popular language learning app, with over 100 million monthly active users and a subscription-based monetisation model.",
    },
    {
        ticker: 'COUR',
        name: 'Coursera',
        slug: 'coursera',
        sector: 'Technology',
        description:
            'Coursera Inc. is a leading online learning platform offering university-level courses, professional certificates, and degrees from 300+ global institutions.',
    },
]

/** Base ticker list merged with long-form editorial content keyed by slug. */
export const TICKER_PAGES: TickerPage[] = TICKER_PAGES_BASE.map((ticker) => {
    const content = TICKER_CONTENT[ticker.slug]
    return content ? { ...ticker, content } : ticker
})

/** A ticker is treated as indexable only once it has long-form `content`. */
export const isTickerEnriched = (
    ticker: TickerPage
): ticker is TickerPage & { content: TickerContent } => ticker.content != null

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
