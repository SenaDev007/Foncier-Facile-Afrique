'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { cn, formatDate, truncate } from '@/lib/utils'
import type { BlogPostWithAuthor } from '@/types'
import { CalendarDays } from 'lucide-react'

const MdOutlineFormatQuote = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M9.99 12.15l-1.42 1.42L7.15 12 0 19.15 7.15 24 14.3 16.85 14.3 0H0v12.15h9.99zM24 0v12.15l-1.42-1.42-1.42 1.42L16.85 12 9.7 19.15 16.85 24 24 16.85V0h-9.7v12.15L24 0z" />
  </svg>
)

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
)

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
)

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'outline' | 'default'
  size?: 'icon' | 'default'
}

const CarouselButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:ring-offset-2 focus-visible:ring-offset-[#161618] disabled:pointer-events-none disabled:opacity-50',
          variant === 'outline' &&
            'border border-[#3A3A3C] bg-[#2C2C2E] text-[#EFEFEF] shadow-sm hover:bg-[#3A3A3C] hover:text-[#EFEFEF]',
          size === 'icon' && 'h-9 w-9',
          className,
        )}
        {...props}
      />
    )
  },
)
CarouselButton.displayName = 'CarouselButton'

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

interface CarouselProps {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel />')
  }
  return context
}

const Carousel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = 'horizontal', opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === 'horizontal' ? 'x' : 'y',
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext],
    )

    React.useEffect(() => {
      if (!api || !setApi) return
      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) return
      onSelect(api)
      api.on('reInit', onSelect)
      api.on('select', onSelect)
      return () => {
        api.off('select', onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation: orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn('relative', className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = 'Carousel'

const CarouselContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel()
    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div
          ref={ref}
          className={cn(
            'flex',
            orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
            className,
          )}
          {...props}
        />
      </div>
    )
  },
)
CarouselContent.displayName = 'CarouselContent'

const CarouselItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel()
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(
          'min-w-0 shrink-0 grow-0 basis-full',
          orientation === 'horizontal' ? 'pl-4' : 'pt-4',
          className,
        )}
        {...props}
      />
    )
  },
)
CarouselItem.displayName = 'CarouselItem'

const CarouselPrevious = forwardRef<HTMLButtonElement, React.ComponentProps<typeof CarouselButton>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()
    return (
      <CarouselButton
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute size-8 rounded-full',
          orientation === 'horizontal'
            ? 'bottom-0 left-1/2 -translate-x-16 translate-y-4'
            : '-top-12 right-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="size-4" />
        <span className="sr-only">Article précédent</span>
      </CarouselButton>
    )
  },
)
CarouselPrevious.displayName = 'CarouselPrevious'

const CarouselNext = forwardRef<HTMLButtonElement, React.ComponentProps<typeof CarouselButton>>(
  ({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()
    return (
      <CarouselButton
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute size-8 rounded-full',
          orientation === 'horizontal'
            ? 'bottom-0 right-1/2 translate-x-16 translate-y-4'
            : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
          className,
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="size-4" />
        <span className="sr-only">Article suivant</span>
      </CarouselButton>
    )
  },
)
CarouselNext.displayName = 'CarouselNext'

export type BlogConseilsCarouselProps = {
  posts: BlogPostWithAuthor[]
}

/** Carrousel articles (Blog & Conseils) — données back-office. L’en-tête de section reste sur la page. */
export function BlogConseilsCarousel({ posts }: BlogConseilsCarouselProps) {
  if (!posts.length) return null

  return (
    <section className="py-2 sm:py-4" aria-label="Articles du blog">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-2">
          <Carousel>
            <div className="relative mx-auto max-w-2xl">
              <CarouselContent>
                {posts.map((post) => {
                  const imageSrc = post.imageUne ?? '/images/blog/investissement.jpg'
                  const author = post.auteur?.name ?? 'FFA'
                  const dateStr = formatDate((post.publishedAt ?? post.createdAt).toString())
                  return (
                    <CarouselItem key={post.id}>
                      <div className="p-2 pb-8">
                        <div className="rounded-2xl border border-[#3A3A3C] bg-[#2C2C2E] p-6 text-center shadow-lg">
                          <MdOutlineFormatQuote className="mx-auto my-3 text-3xl text-[#D4A843]" />
                          <Link href={`/blog/${post.slug}`} className="group block">
                            <h3 className="mx-auto max-w-lg px-2 text-lg font-semibold leading-snug text-[#EFEFEF] group-hover:text-[#D4A843] transition-colors line-clamp-3">
                              {post.titre}
                            </h3>
                            <p className="mx-auto mt-3 max-w-lg px-2 text-sm text-[#8E8E93] line-clamp-3">
                              {truncate(post.resume ?? '', 160)}
                            </p>
                          </Link>
                          <div className="relative mx-auto mt-6 h-40 w-full max-w-md overflow-hidden rounded-xl border border-[#3A3A3C] bg-[#1C1C1E]">
                            {imageSrc.startsWith('http') ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={imageSrc}
                                alt={post.titre}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={imageSrc}
                                alt={post.titre}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 448px"
                              />
                            )}
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-[#8E8E93]">
                            <span className="font-medium text-[#D4A843]">{author}</span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                              {dateStr}
                            </span>
                          </div>
                          <div className="mt-4">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-sm font-medium text-[#D4A843] hover:text-[#E8B84B] hover:underline"
                            >
                              Lire l’article
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <div className="pointer-events-none absolute inset-y-0 left-0 h-full w-2/12 bg-gradient-to-r from-[#161618]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-2/12 bg-gradient-to-l from-[#161618]" />
            </div>
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
