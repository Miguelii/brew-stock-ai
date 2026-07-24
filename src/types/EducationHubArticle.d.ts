export type ArticleTheme =
    | 'stock-analysis'
    | 'investing-strategy'
    | 'personal-finance'
    | 'dividends-income'

export type ArticleList = {
    items: string[]
    ordered?: boolean
}

export type ArticleTable = {
    /** Rendered as a caption above the table; also used as its accessible name. */
    caption?: string
    headers: string[]
    /** Each row must have the same length as `headers`. */
    rows: string[][]
    /** Optional note printed under the table, for assumptions or caveats. */
    footnote?: string
}

export type ArticleCallout = {
    title: string
    body: string
}

export type ArticleSection = {
    heading?: string
    body: string
    /** Optional blocks rendered after `body`, in this order. */
    list?: ArticleList
    table?: ArticleTable
    callout?: ArticleCallout
    /** Extra prose rendered after the blocks above, when the point needs closing out. */
    afterBody?: string
}

export type EducationHubArticle = {
    slug: string
    title: string
    description: string
    publishedAt: string
    /** ISO day (`YYYY-MM-DD`) of the last material edit. Omit when never revised. */
    updatedAt?: string
    readingTimeMinutes: number
    theme: ArticleTheme
    /** Short summary bullets rendered above the body, for readers who skim first. */
    keyTakeaways?: string[]
    sections: ArticleSection[]
}
