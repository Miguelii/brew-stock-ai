import type { TokenPackage } from '@/types/TokenPackage'
import { StarIcon, TrophyIcon, ZapIcon } from 'lucide-react'

export const getPackageIcon = (id: TokenPackage['id']) => {
    if (id === 'free') return TrophyIcon
    if (id === 'starter') return ZapIcon
    if (id === 'pro') return StarIcon
    if (id === 'expert') return TrophyIcon
    return TrophyIcon
}
