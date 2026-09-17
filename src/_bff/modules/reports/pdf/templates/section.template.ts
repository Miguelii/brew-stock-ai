type Props = {
    /** Pre-escaped HTML: section titles are static copy. */
    title: string
    subtitle?: string
    body: string
    // Cream background, used for the sections the page highlights
    isPaper?: boolean
}

/** Report section card: display title with the page's thick heading rule. */
export function sectionTemplate({ title, subtitle, body, isPaper = false }: Props): string {
    const subtitleHtml = subtitle ? `<div class="section-subtitle">${subtitle}</div>` : ''

    return `
    <div class="section${isPaper ? ' section-paper' : ''}">
        <div class="section-head">
            <div class="display section-title">${title}</div>
            ${subtitleHtml}
        </div>
        ${body}
    </div>`
}
