import Link from 'next/link'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#1C1C1E] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Logo FFA animé */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-[#D4A843] flex items-center justify-center">
            <span className="text-[#EFEFEF] font-heading font-bold text-xl">FFA</span>
          </div>
        </div>

        {/* Spinner de chargement */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-[#3A3A3C] border-t-[#D4A843] rounded-full animate-spin"></div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-[#EFEFEF] mb-3">
          Chargement en cours...
        </h1>
        <p className="text-[#8E8E93] text-lg">
          Veuillez patienter pendant que nous préparons votre contenu.
        </p>

        {/* Options de navigation */}
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

        {/* Barre de progression animée */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="h-2 bg-[#3A3A3C] rounded-full overflow-hidden">
            <div className="h-full bg-[#D4A843] rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
