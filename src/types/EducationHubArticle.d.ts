export type ArticleTheme =
    | 'stock-analysis'
    | 'investing-strategy'
    | 'personal-finance'
    | 'dividends-income'

export type EducationHubArticle = {
    slug: string
    title: string
    description: string
    publishedAt: string
    /** ISO day (`YYYY-MM-DD`) of the last material edit. Omit when never revised. */
    updatedAt?: string
    readingTimeMinutes: number
    theme: ArticleTheme
    sections: {
        heading?: string
        body: string
    }[]
}
