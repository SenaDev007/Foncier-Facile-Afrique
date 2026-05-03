'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AdminSearchInputProps {
  placeholder?: string
  paramName?: string
}

export function AdminSearchInput({ 
  placeholder = 'Rechercher...', 
  paramName = 'q' 
}: AdminSearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get(paramName) ?? '')

  useEffect(() => {
    setValue(searchParams.get(paramName) ?? '')
  }, [searchParams, paramName])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set(paramName, value.trim())
    } else {
      params.delete(paramName)
    }
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  const clear = () => {
    setValue('')
    const params = new URLSearchParams(searchParams.toString())
    params.delete(paramName)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93]" aria-hidden="true" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8 bg-[#1C1C1E] border-[#3A3A3C] text-[#EFEFEF] placeholder:text-[#8E8E93] h-9 text-sm focus:ring-[#D4A843]/50"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#8E8E93] hover:text-[#EFEFEF]"
          aria-label="Effacer la recherche"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
