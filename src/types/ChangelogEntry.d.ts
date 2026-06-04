export type ChangelogTag = 'New' | 'Improved' | 'Fixed'

export type ChangelogSection = {
    heading?: string
    body: string
    bullets?: string[]
}

export type ChangelogEntry = {
    slug: string
    version: string
    title: string
    description: string
    publishedAt: string
    tags: ChangelogTag[]
    highlights: string[]
    sections: ChangelogSection[]
}
