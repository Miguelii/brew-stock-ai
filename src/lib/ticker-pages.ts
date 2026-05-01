import type { TickerPage } from '@/types/TickerPage'

export const TICKER_PAGES: TickerPage[] = [
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
            'Meta Platforms operates Facebook, Instagram, and WhatsApp — reaching over 3 billion daily active users. Expanding into AI and the metaverse.',
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
]

export const TICKER_PAGE_MAP = new Map(TICKER_PAGES.map((t) => [t.slug, t]))
