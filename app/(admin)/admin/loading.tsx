export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[50vh]">
      <div className="h-10 w-10 border-4 border-[#3A3A3C] border-t-[#D4A843] rounded-full animate-spin mb-4"></div>
      <p className="text-[#8E8E93] text-sm animate-pulse font-medium">Chargement des données...</p>
    </div>
  )
}
