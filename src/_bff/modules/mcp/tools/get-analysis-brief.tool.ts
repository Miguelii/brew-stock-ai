import { Match } from 'effect'
import { z } from 'zod'
import type { McpServer } from '@modelcontextprotocol/server'
import { PropmptsEnum } from '@/types/PropmptsEnum'
import { getAnalysisBrief } from '@/_bff/modules/analysis/services/get-analysis-brief.service'
import { runToolEffect } from '@/_bff/modules/mcp/helpers/run-tool-effect.helper'

const inputSchema = z.object({
    ticker: z
        .string()
        .trim()
        .min(1)
        .max(15)
        .describe('Stock ticker or company name, e.g. AAPL, MSFT, ASML.AS'),
    analysisType: z
        .enum(PropmptsEnum)
        .default(PropmptsEnum.STOCK_ANALYSIS)
        .describe('Analysis focus. Call list_analysis_types to see the labels.'),
})

export const GET_ANALYSIS_BRIEF_TOOL = (server: McpServer) =>
    server.registerTool(
        'get_analysis_brief',
        {
            title: 'Get stock analysis brief',
            description:
                'Fetches live market data (fundamentals, analyst coverage, earnings, technicals and recent news) for a stock and returns a brief with the analysis method, the request and the data. Write the analysis yourself by following the brief.',
            inputSchema,
            annotations: { readOnlyHint: true, openWorldHint: true },
        },
        ({ ticker, analysisType }) =>
            runToolEffect(
                getAnalysisBrief(ticker.toUpperCase(), analysisType),
                'getAnalysisBrief',
                (brief) => brief,
                (error) =>
                    Match.value(error).pipe(
                        Match.tag(
                            'InvalidPromptTypeError',
                            () =>
                                `Unknown analysis type. Call list_analysis_types for the valid ones.`
                        ),
                        Match.exhaustive
                    )
            )
    )
