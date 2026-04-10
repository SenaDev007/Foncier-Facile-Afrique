import Link from 'next/link'
import { ArrowRight, Play, Target, Crown, Star, Shield, Search, TrendingUp } from 'lucide-react'

type HeroTrustClient = { name: string }

interface GlassHeroProps {
  badge: string
  subtitle: string
  title: string
  highlighted: string
  description: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  statMain: { value: string; label: string }
  statProgress: { label: string; value: number }
  statMini: Array<{ value: string; label: string }>
  clients: HeroTrustClient[]
  backgroundImage: string
}

export default function GlassmorphismTrustHero(props: GlassHeroProps) {
  const {
    badge,
    subtitle,
    title,
    highlighted,
    description,
    ctaPrimary,
    ctaSecondary,
    statMain,
    statProgress,
    statMini,
    clients,
    backgroundImage,
  } = props

  return (
    <div className="relative w-full bg-zinc-950 text-white overflow-hidden font-sans min-h-screen">
      <style>{`
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        .animate-fade-in { animation: fadeSlideIn .8s ease-out forwards; opacity: 0; }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .delay-100 { animation-delay: .1s; } .delay-200 { animation-delay: .2s; } .delay-300 { animation-delay: .3s; } .delay-400 { animation-delay: .4s; } .delay-500 { animation-delay: .5s; }
      `}</style>

      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          maskImage: 'linear-gradient(180deg, transparent, black 0%, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 70%, transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8">
            <div className="animate-fade-in delay-100">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  {badge}
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </span>
              </div>
            </div>
            <p className="animate-fade-in delay-100 text-zinc-400 text-xs">{subtitle}</p>
            <h1 className="animate-fade-in delay-200 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.9]">
              {title}
              <br />
              <span className="bg-gradient-to-br from-white via-white to-[#ffcd75] bg-clip-text text-transparent">{highlighted}</span>
            </h1>
            <p className="animate-fade-in delay-300 max-w-xl text-lg text-zinc-400 leading-relaxed">{description}</p>
            <div className="animate-fade-in delay-400 flex flex-col sm:flex-row gap-4">
              <Link href={ctaPrimary.href} className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.02]">
                {ctaPrimary.label}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={ctaSecondary.href} className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white">
                <Play className="w-4 h-4 fill-current" />
                {ctaSecondary.label}
              </Link>
            </div>
            <div className="animate-fade-in delay-500 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{ icon: Shield, t: 'Sécurité juridique' }, { icon: Search, t: 'Biens vérifiés' }, { icon: TrendingUp, t: 'Rentabilité' }].map((x) => (
                <div key={x.t} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 flex items-center gap-2">
                  <x.icon className="h-4 w-4 text-[#ffcd75]" />
                  {x.t}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:mt-12">
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-white">{statMain.value}</div>
                    <div className="text-sm text-zinc-400">{statMain.label}</div>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">{statProgress.label}</span>
                    <span className="text-white font-medium">{statProgress.value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800/50">
                    <div className="h-full rounded-full bg-gradient-to-r from-white to-zinc-400" style={{ width: `${Math.max(2, Math.min(100, statProgress.value))}%` }} />
                  </div>
                </div>
                <div className="h-px w-full bg-white/10 mb-6" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {statMini.map((s) => (
                    <div key={s.label} className="flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white sm:text-2xl">{s.value}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium sm:text-xs">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    ACTIF
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium tracking-wide text-zinc-300">
                    <Crown className="w-3 h-3 text-yellow-500" />
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in delay-500 relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 py-8 backdrop-blur-xl">
              <h3 className="mb-6 px-8 text-sm font-medium text-zinc-400">Ils nous font confiance</h3>
              <div className="relative flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}>
                <div className="animate-marquee flex gap-12 whitespace-nowrap px-4">
                  {[...clients, ...clients, ...clients].map((client, i) => (
                    <div key={i} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffcd75]" />
                      <span className="text-lg font-bold text-white tracking-tight">{client.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
