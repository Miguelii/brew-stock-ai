import { Fragment } from 'react'

type Props = {
    text: string
}

const BRAND_NAME = 'BrewStock'

/** The brand wordmark: "Brew" keeps the surrounding color, "Stock" is always brand blue. */
export function BrandName() {
    return (
        <span className="font-bold text-primary">
            Brew<span className="text-blue">Stock</span>
        </span>
    )
}

/** Renders plain copy (e.g. FAQ strings) with every brand mention styled as the wordmark. */
export function BrandText({ text }: Props) {
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
