import { describe, it, expect } from 'vitest'
import { verifyMcpToken } from '@/_bff/modules/mcp/helpers/verify-mcp-token.helper'

type TokenSource = { token?: string }

const TOKEN = 'a'.repeat(40)
const UNSET: TokenSource = {}

describe('verifyMcpToken', () => {
    it('accepts the configured token', () => {
        expect(verifyMcpToken(TOKEN, TOKEN)).toBe(true)
    })

    it('rejects a different token, including one of another length', () => {
        expect(verifyMcpToken('b'.repeat(40), TOKEN)).toBe(false)
        expect(verifyMcpToken('short', TOKEN)).toBe(false)
    })

    it('rejects a missing bearer token', () => {
        expect(verifyMcpToken(UNSET.token, TOKEN)).toBe(false)
        expect(verifyMcpToken('', TOKEN)).toBe(false)
    })

    it('rejects everything when no token is configured', () => {
        expect(verifyMcpToken(TOKEN, UNSET.token)).toBe(false)
        expect(verifyMcpToken('', '')).toBe(false)
    })
})
