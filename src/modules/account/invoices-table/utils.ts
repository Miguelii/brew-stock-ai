const PAYMENT_METHOD_LABELS: Record<string, string> = {
    card: 'Card',
    multibanco: 'Multibanco',
    sepa_debit: 'SEPA Debit',
    amazon_pay: 'Amazon Pay',
    ideal: 'iDEAL',
    bancontact: 'Bancontact',
    klarna: 'Klarna',
    link: 'Link',
}

/**
 * Map a payment-method key to its human-friendly label.
 *
 * @param method - The payment-method key (e.g. `"sepa_debit"`), possibly undefined.
 * @returns The display label, the raw key when unknown, or `"—"` when absent.
 */
export function formatPaymentMethod(method: string | undefined): string {
    if (!method) return '—'
    return PAYMENT_METHOD_LABELS[method] ?? method
}
