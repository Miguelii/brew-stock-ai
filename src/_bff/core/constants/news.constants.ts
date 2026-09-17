export const NEWS_IMAGE_SOURCES: readonly {
    hostname: string
    pathnamePrefix: string
}[] = [
    { hostname: 'static.seekingalpha.com', pathnamePrefix: '/cdn/s3/uploads/' },
    { hostname: 'cdn.benzinga.com', pathnamePrefix: '/files/images/story/' },
    { hostname: 'image.cnbcfm.com', pathnamePrefix: '/api/v1/image/' },
]
