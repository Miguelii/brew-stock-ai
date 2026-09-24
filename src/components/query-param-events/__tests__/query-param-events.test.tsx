import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

const { trackEventMock } = vi.hoisted(() => ({ trackEventMock: vi.fn() }))

vi.mock('@/lib/analytics', () => ({ trackEvent: trackEventMock }))

const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

/**
 * The component consumes the URL once per document load, so each case needs a fresh
 * module instance. Only the component is re-imported: resetting React itself would
 * hand `render` a second copy and break the hook dispatcher.
 */
const renderAt = async (url: string) => {
    window.history.replaceState({}, '', url)
    trackEventMock.mockClear()
    replaceStateSpy.mockClear()

    vi.resetModules()
    const { QueryParamEvents } = await import('@/components/query-param-events')

    render(<QueryParamEvents />)

    // Returned so a case can mount this same module instance again, which is what
    // the once-per-document-load guard is about.
    return QueryParamEvents
}

const search = () => new URLSearchParams(window.location.search)

describe('QueryParamEvents', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('sign-in conversions', () => {
        it('reports a sign up with the method that produced it', async () => {
            await renderAt('/analysis?authEvent=sign_up&authMethod=google')

            expect(trackEventMock).toHaveBeenCalledExactlyOnceWith('sign_up', {
                method: 'google',
            })
        })

        it('reports a returning login', async () => {
            await renderAt('/analysis?authEvent=login&authMethod=otp')

            expect(trackEventMock).toHaveBeenCalledExactlyOnceWith('login', { method: 'otp' })
        })

        it('ignores an auth event that is not one we emit', async () => {
            await renderAt('/analysis?authEvent=drop_table_users')

            expect(trackEventMock).not.toHaveBeenCalled()
        })
    })

    describe('purchase conversions', () => {
        it('reports the order with the Stripe session as transaction id', async () => {
            await renderAt('/tokens?success=true&value=2.49&credits=15&session_id=cs_test_1')

            expect(trackEventMock).toHaveBeenCalledExactlyOnceWith('purchase', {
                transaction_id: 'cs_test_1',
                currency: 'EUR',
                value: 2.49,
                credits: 15,
            })
        })

        it('omits a value that is missing rather than reporting a free order', async () => {
            await renderAt('/tokens?success=true&session_id=cs_test_2')

            expect(trackEventMock).toHaveBeenCalledExactlyOnceWith('purchase', {
                transaction_id: 'cs_test_2',
                currency: 'EUR',
                value: undefined,
                credits: undefined,
            })
        })

        it('omits values that cannot be parsed', async () => {
            await renderAt('/tokens?session_id=cs_test_3&value=abc&credits=')

            expect(trackEventMock).toHaveBeenCalledExactlyOnceWith(
                'purchase',
                expect.objectContaining({ value: undefined, credits: undefined })
            )
        })

        it('reports nothing without a session id, since there is no transaction to dedupe on', async () => {
            await renderAt('/tokens?success=true&value=2.49&credits=15')

            expect(trackEventMock).not.toHaveBeenCalled()
        })
    })

    describe('URL cleanup', () => {
        it('strips the analytics params it consumed', async () => {
            await renderAt('/tokens?success=true&value=2.49&credits=15&session_id=cs_test_4')

            expect(search().has('session_id')).toBe(false)
            expect(search().has('value')).toBe(false)
            expect(search().has('credits')).toBe(false)
        })

        it('keeps the params the pages themselves read', async () => {
            await renderAt('/tokens?success=true&session_id=cs_test_5')

            // /tokens renders its success banner from this one, server-side.
            expect(search().get('success')).toBe('true')
            expect(window.location.pathname).toBe('/tokens')
        })

        it('leaves unrelated params alone', async () => {
            await renderAt('/analysis?authEvent=login&utm_source=newsletter')

            expect(search().get('utm_source')).toBe('newsletter')
            expect(search().has('authEvent')).toBe(false)
        })

        it('does not touch history when there is nothing to strip', async () => {
            await renderAt('/pricing?utm_source=newsletter')

            expect(replaceStateSpy).not.toHaveBeenCalled()
            expect(search().get('utm_source')).toBe('newsletter')
        })
    })

    describe('guards', () => {
        it('does nothing at all when there is no query string', async () => {
            await renderAt('/pricing')

            expect(trackEventMock).not.toHaveBeenCalled()
            expect(replaceStateSpy).not.toHaveBeenCalled()
        })

        it('consumes the URL once per document load, not once per mount', async () => {
            const url = '/analysis?authEvent=sign_up&authMethod=google'
            const QueryParamEvents = await renderAt(url)

            expect(trackEventMock).toHaveBeenCalledTimes(1)

            // A per-instance guard (a ref) would replay the conversion here.
            window.history.replaceState({}, '', url)
            render(<QueryParamEvents />)

            expect(trackEventMock).toHaveBeenCalledTimes(1)
        })
    })
})
