'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const TRACK_HEIGHT = 'min(44vh, 380px)'

/**
 * Pinned horizontal scroll. The section stays put while its track slides sideways,
 * then releases. Degrades to a native snap carousel below the lg breakpoint.
 */
export function HorizontalTrack({ children }: Props) {
    const outerRef = useRef<HTMLDivElement>(null)
    const wrapRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [distance, setDistance] = useState(0)
    const reduced = useReducedMotion()

    const { scrollYProgress } = useScroll({
        target: outerRef,
        offset: ['start start', 'end end'],
    })

    const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

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
        window.addEventListener('resize', measure)

        return () => {
            observer.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [])

    const carousel = (
        <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8">
            {children}
        </div>
    )

    if (reduced) return carousel

    return (
        <>
            <div className="lg:hidden">{carousel}</div>

            <div
                ref={outerRef}
                data-scroll-scene
                className="relative hidden lg:block"
                style={{ height: `calc(100svh + ${distance}px)` }}
            >
                {/* Full-height sticky so the track sits centred in the viewport while pinned. */}
                <div
                    ref={wrapRef}
                    data-scroll-sticky
                    className="sticky top-0 flex h-svh items-center overflow-hidden"
                >
                    <motion.div
                        ref={trackRef}
                        style={{ x, height: TRACK_HEIGHT }}
                        className="flex w-max gap-5"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </>
    )
}
