import { describe, it, expect } from 'vitest'
import { TOKEN_PACKAGES } from '@/services/core/tokens/helpers/constants'

describe('TOKEN_PACKAGES', () => {
    it('contains exactly 3 packages', () => {
        expect(TOKEN_PACKAGES).toHaveLength(3)
    })

    it('each package has required fields', () => {
        for (const pkg of TOKEN_PACKAGES) {
            expect(pkg).toHaveProperty('id')
            expect(pkg).toHaveProperty('credits')
            expect(pkg).toHaveProperty('amount')
            expect(pkg).toHaveProperty('label')
        }
    })

    it('packages are ordered by credits ascending', () => {
        for (let i = 1; i < TOKEN_PACKAGES.length; i++) {
            expect(TOKEN_PACKAGES[i].credits).toBeGreaterThan(TOKEN_PACKAGES[i - 1].credits)
        }
    })

    it('packages are ordered by amount ascending', () => {
        for (let i = 1; i < TOKEN_PACKAGES.length; i++) {
            expect(TOKEN_PACKAGES[i].amount).toBeGreaterThan(TOKEN_PACKAGES[i - 1].amount)
        }
    })

    it('all amounts are positive integers (cents)', () => {
        for (const pkg of TOKEN_PACKAGES) {
            expect(Number.isInteger(pkg.amount)).toBe(true)
            expect(pkg.amount).toBeGreaterThan(0)
        }
    })

    it('all credits are positive integers', () => {
        for (const pkg of TOKEN_PACKAGES) {
            expect(Number.isInteger(pkg.credits)).toBe(true)
            expect(pkg.credits).toBeGreaterThan(0)
        }
    })

    it('each package has a unique id', () => {
        const ids = TOKEN_PACKAGES.map((p) => p.id)
        expect(new Set(ids).size).toBe(ids.length)
    })
})
