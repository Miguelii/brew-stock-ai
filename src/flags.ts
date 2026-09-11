import { flag } from 'flags/next'
import { vercelAdapter } from '@flags-sdk/vercel'

export const isAppMaintenanceFlag = flag<boolean>({
    key: 'IS_APP_MAINTENANCE',
    description: 'Puts the app into maintenance mode when enabled.',
    defaultValue: false,
    adapter: vercelAdapter,
})
