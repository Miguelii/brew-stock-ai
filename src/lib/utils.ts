import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { STATIC_PREFIXES } from '../lib/constants'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getBuildId = () => {
    return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? '1'
}

export function normalizeWebsiteUrl(normalized = 'http://localhost:3000'): string {
    // Always returns https
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`
    }

    // Always returns without final slash
    if (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1)
    }

    return normalized
}

export const isPathFromStaticFiles = (pathname: string): boolean => {
    return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}
