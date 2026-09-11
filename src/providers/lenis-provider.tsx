'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Smooth scroll for the public marketing pages. Mounted in the (public) layout only,
 * so the authenticated app keeps native scrolling. Does nothing under reduced motion.
 */
export function LenisProvider() {
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

        let frame = requestAnimationFrame(function raf(time: number) {
            lenis.raf(time)
            frame = requestAnimationFrame(raf)
        })

        return () => {
            cancelAnimationFrame(frame)
            lenis.destroy()
        }
    }, [])

    return null
}
