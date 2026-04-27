import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { STATIC_PREFIXES } from '@/lib/constants'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getBuildId = () => {
    return process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? '1'
}

export const isPathFromStaticFiles = (pathname: string): boolean => {
    return STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export const parseReportDate = (date: string) => {
    return date.slice(0, 16).replace('T', ' ')
}
