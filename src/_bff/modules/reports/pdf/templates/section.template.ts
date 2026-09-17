type Props = {
    /** Pre-escaped HTML: section titles are static copy. */
    title: string
    subtitle?: string
    body: string
    // Kept on the same page as the heading
    lead?: string
    // Cream background, used for the sections the page highlights
    isPaper?: boolean
    // Short sections that should never split across pages
    isCompact?: boolean
}

/** Report section card: display title with the page's thick heading rule. */
export function sectionTemplate({
    title,
    subtitle,
    body,
    lead = '',
    isPaper = false,
    isCompact = false,
}: Props): string {
    const subtitleHtml = subtitle ? `<div class="section-subtitle">${subtitle}</div>` : ''
    const classes = ['section', isPaper && 'section-paper', isCompact && 'section-compact']
        .filter(Boolean)
        .join(' ')

    return `
    <div class="${classes}">
        <div class="section-lead">
            <div class="section-head">
                <div class="display section-title">${title}</div>
                ${subtitleHtml}
            </div>
            ${lead}
        </div>
        ${body}
    </div>`
}
