import { defineConfig } from '@trigger.dev/sdk/v3'

export default defineConfig({
    project: 'proj_owwdlmiwmyjoanyavhwh',
    runtime: 'node-24',
    logLevel: 'log',
    maxDuration: 3600,
    retries: {
        enabledInDev: true,
        default: {
            maxAttempts: 1,
            minTimeoutInMs: 1000,
            maxTimeoutInMs: 10000,
            factor: 2,
            randomize: true,
        },
    },
    dirs: ['./src/_bff/modules/reports/jobs'],
})
