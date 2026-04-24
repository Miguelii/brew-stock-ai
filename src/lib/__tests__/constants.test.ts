import { describe, expect, it } from 'vitest'
import { NEXT_IMAGE_PATH, NEXT_STATIC_PATH, PROMPT_TYPES, STATIC_PREFIXES } from '@/lib/constants'

describe('constants', () => {
    it('should define STATIC_PREFIXES', () => {
        expect(STATIC_PREFIXES).toBeDefined()
    })

    it('should define PROMPT_TYPES', () => {
        expect(PROMPT_TYPES).toBeDefined()
    })

    it('should define NEXT_IMAGE_PATH', () => {
        expect(NEXT_IMAGE_PATH).toBe('/_next/image')
    })

    it('should define NEXT_STATIC_PATH', () => {
        expect(NEXT_STATIC_PATH).toBe('/_next/static')
    })
})
