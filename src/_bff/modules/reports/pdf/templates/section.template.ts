type Props = {
    /** Pre-escaped HTML: section titles are static copy. */
    title: string
    subtitle?: string
    body: string
}

/** Bordered report section. Without a subtitle, the title carries the spacing itself. */
export function sectionTemplate({ title, subtitle, body }: Props): string {
    const heading = subtitle
        ? `<div class="extra-section-title">${title}</div>
        <div class="extra-section-subtitle">${subtitle}</div>`
        : `<div class="extra-section-title" style="margin-bottom: 14px;">${title}</div>`

    return `
    <div class="extra-section">
        ${heading}
        ${body}
    </div>`
}
