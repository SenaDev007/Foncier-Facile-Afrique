import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[120px] font-bold text-[#D4A843] leading-none opacity-20 font-heading">404</div>
        <h1 className="font-heading text-3xl font-bold text-[#EFEFEF] mt-4">Page introuvable</h1>
        <p className="text-[#8E8E93] mt-3 text-lg">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/"
            className="bg-[#D4A843] text-[#EFEFEF] px-6 py-3 rounded-lg font-medium hover:bg-[#B8912E] transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/annonces"
            className="border-2 border-[#D4A843] text-[#D4A843] px-6 py-3 rounded-lg font-medium hover:bg-[#D4A843] hover:text-[#EFEFEF] transition-colors"
          >
            Voir les annonces
          </Link>
        </div>
      </div>
    </div>
  )
}
