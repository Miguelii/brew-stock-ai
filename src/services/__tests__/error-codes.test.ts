import { describe, expect, it } from 'vitest'
import { ErrorCode } from '@/services/error-codes'

describe('ErrorCode enum', () => {
    it('should not contain duplicate error codes', () => {
        const values = Object.values(ErrorCode)

        const uniqueValues = new Set(values)

        expect(uniqueValues.size).toBe(values.length)
    })
})
