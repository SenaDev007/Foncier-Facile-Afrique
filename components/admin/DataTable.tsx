'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  className?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
  keyExtractor: (row: T) => string
}

type SortDirection = 'asc' | 'desc' | null

export function DataTable<T>({
  data,
  columns,
  emptyMessage = 'Aucune donnée.',
  keyExtractor,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDirection>(null)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0
    const aVal = (a as Record<string, unknown>)[sortKey]
    const bVal = (b as Record<string, unknown>)[sortKey]
    if (aVal === bVal) return 0
    const cmp = String(aVal ?? '').localeCompare(String(bVal ?? ''), 'fr', { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="bg-[#2C2C2E] border border-[#3A3A3C] rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#3A3A3C]">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`text-left px-4 py-3 text-[#8E8E93] font-medium whitespace-nowrap ${col.className ?? ''}`}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(String(col.key))}
                    className="inline-flex items-center gap-1 hover:text-[#EFEFEF] transition-colors"
                  >
                    {col.header}
                    {sortKey === String(col.key) ? (
                      sortDir === 'asc' ? (
                        <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : sortDir === 'desc' ? (
                        <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-[#8E8E93]">
                {emptyMessage}
              </td>
            </tr>
          )}
          {sorted.map((row) => (
            <tr
              key={keyExtractor(row)}
              className="border-b border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-4 py-3 ${col.className ?? ''}`}
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
