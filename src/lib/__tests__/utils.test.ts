import { describe, it, expect, vi } from 'vitest'
import { getBuildId, isPathFromStaticFiles } from '@/lib/utils'

describe('utils', () => {
    describe('getBuildId', () => {
        it('should return NEXT_PUBLIC_BUILD_TIMESTAMP when it is defined', () => {
            vi.stubEnv('NEXT_PUBLIC_BUILD_TIMESTAMP', '1234567890')
            expect(getBuildId()).toBe('1234567890')
        })

        it('should return "1" as default when NEXT_PUBLIC_BUILD_TIMESTAMP is undefined', () => {
            vi.stubEnv('NEXT_PUBLIC_BUILD_TIMESTAMP', undefined)
            expect(getBuildId()).toBe('1')
        })

        it('should return the environment variable value when set to any string', () => {
            vi.stubEnv('NEXT_PUBLIC_BUILD_TIMESTAMP', 'build-id-123')
            expect(getBuildId()).toBe('build-id-123')
        })
    })

    describe('isPathFromStaticFiles', () => {
        describe('Next.js internal routes', () => {
            it('should return true for /_next routes', () => {
                expect(isPathFromStaticFiles('/_next/static/chunks/main.js')).toBe(true)
            })

            it('should return true for /_next/image routes', () => {
                expect(isPathFromStaticFiles('/_next/image?url=/image.png')).toBe(true)
            })
        })

        describe('API routes', () => {
            it('should return true for /api/ routes', () => {
                expect(isPathFromStaticFiles('/api/users')).toBe(true)
            })
        })

        describe('Favicon', () => {
            it('should return true for /favicon routes', () => {
                expect(isPathFromStaticFiles('/favicon.ico')).toBe(true)
            })
        })

        describe('Public folder', () => {
            it('should return true for /assets routes', () => {
                expect(isPathFromStaticFiles('/assets/image.png')).toBe(true)
            })

            it('should return true for robots.txt', () => {
                expect(isPathFromStaticFiles('/robots.txt')).toBe(true)
            })
        })

        describe('Regular page routes', () => {
            it('should return false for root path', () => {
                expect(isPathFromStaticFiles('/')).toBe(false)
            })

            it('should return false for regular page routes', () => {
                expect(isPathFromStaticFiles('/about')).toBe(false)
            })

            it('should return false for nested page routes', () => {
                expect(isPathFromStaticFiles('/work/project-1')).toBe(false)
            })
        })
    })
})
