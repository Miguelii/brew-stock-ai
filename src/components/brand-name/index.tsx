import { cn } from '@/lib/utils'
import { Fragment } from 'react'

type BrandTextProps = {
    text: string
}

type BrandNameProps = {
    className?: string
}

const BRAND_NAME = 'BrewStock'

/** The brand wordmark: "Brew" keeps the surrounding color, "Stock" is always brand blue. */
export function BrandName({ className }: BrandNameProps) {
    return (
        <span className={cn('font-bold text-primary', className)}>
            Brew<span className="text-blue">Stock</span>
        </span>
    )
}

/** Renders plain copy (e.g. FAQ strings) with every brand mention styled as the wordmark. */
export function BrandText({ text }: BrandTextProps) {
    const [first, ...rest] = text.split(BRAND_NAME)

    return (
        <>
            {first}
            {rest.map((part, index) => (
                // The split parts are static and never reorder, so the position is a stable key
                <Fragment key={index}>
                    <BrandName />
                    {part}
                </Fragment>
            ))}
        </>
    )
}
