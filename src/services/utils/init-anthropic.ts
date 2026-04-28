import 'server-only'

import { createAnthropic } from '@ai-sdk/anthropic'
import { ServerEnv } from '@/env/server'

export const anthropic = createAnthropic({
    apiKey: ServerEnv.NEXT_ANTHROPIC_AI_KEY,
})
