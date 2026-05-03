export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#1C1C1E]">
      <div className="relative flex items-center justify-center h-16 w-16 mb-4">
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#D4A843] animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-[#EFEFEF] animate-spin-reverse"></div>
      </div>
      <p className="text-[#8E8E93] text-sm animate-pulse font-medium">Chargement en cours...</p>
    </div>
  )
}
