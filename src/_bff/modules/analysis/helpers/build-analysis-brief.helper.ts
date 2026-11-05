import {
    AnalystMethodPrompt,
    MarkdownOutputFormatPrompt,
    ProvidedDataPrompt,
} from '@/_bff/modules/analysis/prompts/system.prompt'

type Props = {
    stockSymbol: string
    promptTemplate: string
    /** Output of `buildMarketContext`: `''` when no source returned data */
    context: string
    /** Ticker Yahoo resolved the symbol to, `null` when there is no Yahoo data */
    resolvedTicker: string | null
    /** `false` when the Yahoo data came from the stored `stock_data` snapshot */
    isFresh: boolean
    retrievedAt: Date
}

const buildDataNotes = ({
    stockSymbol,
    context,
    resolvedTicker,
    isFresh,
    retrievedAt,
}: Omit<Props, 'promptTemplate'>) => {
    const notes = [`- Data retrieved at ${retrievedAt.toISOString()}.`]

    if (resolvedTicker && resolvedTicker !== stockSymbol) {
        notes.push(`- "${stockSymbol}" was resolved to the ticker ${resolvedTicker}.`)
    }

    if (!context) {
        notes.push(
            `- No market data was available for ${stockSymbol}. Tell the user up front, and label every figure you use as coming from your own knowledge rather than live data.`
        )
    } else if (resolvedTicker && !isFresh) {
        notes.push(
            '- The live market data source was unreachable, so the figures below come from a stored snapshot and may be out of date. Say so in the analysis.'
        )
    }

    return notes.join('\n')
}

/**
 * The full brief the MCP returns: the same method and context the app pipeline
 * feeds the model, with a Markdown output contract instead of the JSON one.
 */
export const buildAnalysisBrief = (props: Props) => {
    const request = props.promptTemplate.replaceAll('##TICKER##', props.stockSymbol).trim()

    return [
        `# Analysis brief: ${props.stockSymbol}`,
        'Write the analysis yourself, following this brief. It holds your method, the request and the market data.',
        '---',
        `${AnalystMethodPrompt}${MarkdownOutputFormatPrompt}${ProvidedDataPrompt}`.trim(),
        '---',
        `## Request\n\n${request}`,
        `## Data notes\n\n${buildDataNotes(props)}`,
        props.context.trim(),
    ]
        .filter(Boolean)
        .join('\n\n')
}
