import { Match } from 'effect'
import type { McpServer } from '@modelcontextprotocol/server'
import { listAnalysisTypes } from '@/_bff/modules/analysis/services/list-analysis-types.service'
import { runToolEffect } from '@/_bff/modules/mcp/helpers/run-tool-effect.helper'

export const LIST_ANALYSIS_TYPES_TOOL = (server: McpServer) =>
    server.registerTool(
        'list_analysis_types',
        {
            title: 'List analysis types',
            description:
                'Lists the stock analysis types get_analysis_brief accepts, with a label for each.',
            annotations: { readOnlyHint: true, openWorldHint: false },
        },
        () =>
            runToolEffect(
                listAnalysisTypes(),
                'listAnalysisTypes',
                (types) => types.map(({ type, label }) => `- ${type}: ${label}`).join('\n'),
                (error) => Match.value(error).pipe(Match.exhaustive)
            )
    )
