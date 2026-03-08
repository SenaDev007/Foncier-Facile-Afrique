import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F9F6] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-bold text-[#1A6B3A] leading-none opacity-20 font-heading">404</div>
        <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] mt-4">Page introuvable</h1>
        <p className="text-[#6B7280] mt-3 text-lg">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/"
            className="bg-[#1A6B3A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#145530] transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/annonces"
            className="border-2 border-[#1A6B3A] text-[#1A6B3A] px-6 py-3 rounded-lg font-medium hover:bg-[#1A6B3A] hover:text-white transition-colors"
          >
            Voir les annonces
          </Link>
        </div>
      </div>
    </div>
  )
}
