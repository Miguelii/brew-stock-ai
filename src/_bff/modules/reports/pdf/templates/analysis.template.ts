/** The model's analysis. Receives HTML that was already sanitized. */
export const analysisTemplate = (sanitizedHtml: string): string => `
    <hr class="divider" />

    <div class="analysis">
        ${sanitizedHtml}
    </div>`
