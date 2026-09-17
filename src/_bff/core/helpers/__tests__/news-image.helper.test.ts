import { describe, it, expect } from 'vitest'
import { getNewsImageUrl } from '@/_bff/core/helpers/news-image.helper'

describe('getNewsImageUrl', () => {
    it('keeps photos from every allowlisted source', () => {
        const urls = [
            'https://static.seekingalpha.com/cdn/s3/uploads/getty_images/1359528534/image_1359528534.jpg?io=getty-c-w1536',
            'https://cdn.benzinga.com/files/images/story/2026/09/16/Apple.jpg?width=2048&height=1536',
            'https://image.cnbcfm.com/api/v1/image/108363437-1789528581187.jpg?v=1789528575&w=1920&h=1080',
        ]

        for (const url of urls) {
            expect(getNewsImageUrl(url)).toBe(url)
        }
    })

    it('rejects the Yahoo Finance placeholder logo', () => {
        expect(
            getNewsImageUrl('https://s.yimg.com/rz/stage/p/yahoo_finance_en-US_h_p_finance_2.png')
        ).toBeNull()
    })

    it('rejects generic images on an allowlisted host but outside its path', () => {
        expect(
            getNewsImageUrl('https://static.seekingalpha.com/assets/og_image_1200-29b2bfe1.png')
        ).toBeNull()
    })

    it('rejects look-alike hosts', () => {
        expect(
            getNewsImageUrl('https://cdn.benzinga.com.evil.test/files/images/story/a.jpg')
        ).toBeNull()
        expect(getNewsImageUrl('https://evil.cdn.benzinga.com/files/images/story/a.jpg')).toBeNull()
    })

    it('rejects non-https URLs', () => {
        expect(getNewsImageUrl('http://cdn.benzinga.com/files/images/story/a.jpg')).toBeNull()
    })

    it('returns null for empty and malformed values', () => {
        expect(getNewsImageUrl('')).toBeNull()
        expect(getNewsImageUrl(null)).toBeNull()
        // oxlint-disable-next-line unicorn/no-useless-undefined
        expect(getNewsImageUrl(undefined)).toBeNull()
        expect(getNewsImageUrl('not a url')).toBeNull()
    })
})
