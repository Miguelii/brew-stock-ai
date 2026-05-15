export type EducationHubArticle = {
    slug: string
    title: string
    description: string
    publishedAt: string
    readingTimeMinutes: number
    sections: {
        heading?: string
        body: string
    }[]
}
