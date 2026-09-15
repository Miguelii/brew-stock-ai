'use client'

import { m, useMotionTemplate, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = {
    children: ReactNode
}

/**
 * Pinned horizontal scroll. The section stays put while its track slides sideways,
 * then releases. Below lg, and under reduced motion, the very same markup lays out
 * as a native snap carousel, so the children are mounted once and the tree never
 * differs between the server and the client.
 */
export function HorizontalTrack({ children }: Props) {
    const outerRef = useRef<HTMLDivElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [distance, setDistance] = useState(0)

    const { scrollYProgress } = useScroll({
        target: outerRef,
        offset: ['start start', 'end end'],
    })

    // Published as a custom property so only the lg layout consumes it.
    const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
    const trackX = useMotionTemplate`translateX(${x}px)`

    useEffect(() => {
        const measure = () => {
            const track = trackRef.current
            const wrap = wrapRef.current
            if (!track || !wrap) return
            setDistance(Math.max(0, track.scrollWidth - wrap.clientWidth))
        }

        measure()

        const observer = new ResizeObserver(measure)
        if (trackRef.current) observer.observe(trackRef.current)
        if (wrapRef.current) observer.observe(wrapRef.current)

        // Web fonts change card widths, so re-measure once they land.
        void document.fonts?.ready.then(measure)

        // Both observed elements resize with the viewport, so no window listener is needed
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={outerRef}
            data-scroll-scene
            className="relative lg:h-[calc(100svh+var(--track-distance))]"
            style={{ '--track-distance': `${distance}px` } as CSSProperties}
        >
            {/* Full-height sticky so the track sits centred in the viewport while pinned. */}
            <div
                ref={wrapRef}
                data-scroll-sticky
                className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:overflow-hidden"
            >
                <m.div
                    ref={trackRef}
                    data-scroll-track
                    style={{ '--track-x': trackX } as CSSProperties}
                    className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:h-[min(44vh,380px)] lg:w-max lg:snap-none lg:overflow-x-visible lg:px-0 lg:pb-0 lg:[transform:var(--track-x)]"
                >
                    {children}
                </m.div>
            </div>
        </div>
    )
}
