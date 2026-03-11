'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  target: number       // valeur finale (ex: 200)
  suffix?: string      // ex: "+" ou "%"
  prefix?: string      // ex: "+" ou ">"
  duration?: number    // durée en ms (défaut: 2000)
  label: string
}

export function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
  duration = 2000,
  label,
}: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const startTime = performance.now()
    const startValue = 0

    // Easing ease-out cubique
    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3)
    }

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      setCount(Math.floor(startValue + (target - startValue) * easedProgress))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [isInView, target, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="text-[#D4A843] font-bold text-5xl font-heading tabular-nums">
        {prefix}{count}{suffix}
      </div>
      <div className="text-[#8E8E93] text-sm mt-2 uppercase tracking-widest">
        {label}
      </div>
    </div>
  )
}
