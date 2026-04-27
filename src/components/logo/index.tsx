import Image from 'next/image'
import Link from 'next/link'

type Props = {
    imageSize?: number
}

export default function Logo({ imageSize = 28 }: Props) {
    return (
        <Link className="flex items-center gap-2 justify-start" href="/" prefetch={false}>
            <Image
                height={imageSize}
                width={imageSize}
                src="/assets/logo_v2.png"
                alt="StockBrewAI logo"
            />
            <div className="font-bold text-lg tracking-tight pt-1.5">
                <span>StockBrew</span>
                <span className="text-accent-blue font-mono">AI</span>
            </div>
        </Link>
    )
}
