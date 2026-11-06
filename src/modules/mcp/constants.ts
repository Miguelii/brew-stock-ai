type SetupStep = {
    title: string
    description: string
    command?: string
}

type ExamplePrompt = {
    prompt: string
    analysisType: string
}

const MARKETPLACE_REPO = 'Miguelii/brew-stock-ai'

const PLUGIN_ID = 'brewstock@brewstockai'

export const SETUP_STEPS: readonly SetupStep[] = [
    {
        title: 'Request an access token',
        description:
            'The MCP server is in private access for now. Send us a message from the contact page and we will get back to you. Treat it like a password: it is the only thing that authorizes your calls.',
    },
    {
        title: 'Add the BrewStock marketplace',
        description:
            'Open Claude Code in any folder and add our plugin marketplace. It points Claude Code at the public repository that hosts the plugin.',
        command: `/plugin marketplace add ${MARKETPLACE_REPO}`,
    },
    {
        title: 'Install the plugin',
        description:
            'Install the brewstock plugin. Claude Code asks for your BrewStock MCP token: paste it and keep the default URL. The token is stored as a secret, outside your project files.',
        command: `/plugin install ${PLUGIN_ID}`,
    },
    {
        title: 'Check the connection',
        description:
            'Run the MCP panel and look for brewstock with a connected status and two tools. If it is missing, start a new session so Claude Code loads the plugin.',
        command: '/mcp',
    },
] as const

export const EXAMPLE_PROMPTS: readonly ExamplePrompt[] = [
    { prompt: 'Analyze AAPL', analysisType: 'Wall Street analysis' },
    { prompt: 'Break down the financials of Microsoft', analysisType: 'Deep financial breakdown' },
    { prompt: 'What is the moat of ASML?', analysisType: 'Competitive advantage' },
    { prompt: 'What could go wrong with Tesla?', analysisType: 'Risk analysis' },
    { prompt: 'How much can Shopify still grow?', analysisType: 'Growth potential' },
    { prompt: 'Compare NVDA and AMD', analysisType: 'One brief per company' },
] as const

export const MCP_TOOLS = [
    {
        name: 'get_analysis_brief',
        description:
            'Takes a ticker (or a company name) and an analysis type. Returns the analysis method, the sections to write and live market data: fundamentals, analyst coverage, earnings, technicals and recent news.',
    },
    {
        name: 'list_analysis_types',
        description: 'Lists the five analysis types the brief accepts, with a label for each.',
    },
] as const
