'use client'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  children: React.ReactNode
  delay?: number       // délai en secondes (ex: 0.1, 0.2, 0.3)
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}

export function AnimateOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
}: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // ease custom fluide
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}
