'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'

export function AdminMobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Fermer le menu lors d'un changement de route
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-[#3A3A3C] transition-colors"
      >
        <Menu className="w-6 h-6 text-[#EFEFEF]" />
      </button>

      {/* Overlay & Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex w-64 flex-col bg-[#1C1C1E] animate-in slide-in-from-left duration-200">
            <button 
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-[#3A3A3C] transition-colors"
            >
              <X className="w-5 h-5 text-[#EFEFEF]" />
            </button>
            <div className="flex-1 overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
