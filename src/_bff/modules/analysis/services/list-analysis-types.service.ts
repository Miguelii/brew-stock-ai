import { Effect } from 'effect'
import { PROMPT_OPTIONS } from '@/_bff/core/constants/prompt-types.constants'

/** The analysis types an external model can request, without the app's credit costs. */
export const listAnalysisTypes = () =>
    Effect.succeed(PROMPT_OPTIONS.map(({ type, label }) => ({ type, label })))
