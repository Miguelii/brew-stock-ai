import { Effect } from 'effect'
import { InvalidPromptTypeError } from '@/_bff/lib/errors'
import { ErrorCode } from '@/_bff/lib/error-codes'
import { PROMPTS_MAP } from '@/_bff/modules/analysis/constants'
import { hasOwnKey } from '@/_bff/core/utils/lookup.utils'

export const resolvePromptTemplate = Effect.fn('resolvePromptTemplate')(function* (
    promptType: string
) {
    if (!hasOwnKey(PROMPTS_MAP, promptType)) {
        return yield* new InvalidPromptTypeError({
            promptType,
            error_hash: ErrorCode.ANALYSIS_INVALID_PROMPT,
        })
    }

    return PROMPTS_MAP[promptType]
})
