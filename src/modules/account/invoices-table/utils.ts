import { hasOwnKey } from '@/_bff/core/utils/lookup.utils'

const PAYMENT_METHOD_LABELS = {
    card: 'Card',
    multibanco: 'Multibanco',
    sepa_debit: 'SEPA Debit',
    amazon_pay: 'Amazon Pay',
    ideal: 'iDEAL',
    bancontact: 'Bancontact',
    klarna: 'Klarna',
    link: 'Link',
} satisfies Record<string, string>

/**
 * Map a payment-method key to its human-friendly label.
 *
 * @param method - The payment-method key (e.g. `"sepa_debit"`), possibly undefined.
 * @returns The display label, the raw key when unknown, or `"—"` when absent.
 */
export function formatPaymentMethod(method: string | undefined): string {
    if (!method) return '—'
    return hasOwnKey(PAYMENT_METHOD_LABELS, method) ? PAYMENT_METHOD_LABELS[method] : method
}
