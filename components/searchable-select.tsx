"use client"

import { useState, useRef, useEffect, useId } from "react"
import { ChevronDown, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchableSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  id?: string
  required?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  error,
  id,
  required,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const fieldId = id ?? generatedId

  const filtered = query
    ? options.filter((o) =>
        o.toLowerCase().includes(query.toLowerCase())
      )
    : options

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  function handleSelect(option: string) {
    onChange(option === "-" ? "" : option)
    setOpen(false)
    setQuery("")
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange("")
    setQuery("")
  }

  const displayValue = value || ""

  return (
    <div ref={containerRef} className="relative" id={fieldId}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-[6px] border bg-white transition-all text-left",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-[#404653] focus:ring-[#C2D82F]/50 focus:border-[#C2D82F]",
          !displayValue && "text-[#9aa0ad]"
        )}
        style={{ color: displayValue ? "#404653" : undefined }}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <span className="flex items-center gap-1 ml-2 shrink-0">
          {displayValue && (
            <X
              size={14}
              className="text-[#9aa0ad] hover:text-[#404653]"
              onClick={handleClear}
              aria-label="Limpar seleção"
            />
          )}
          <ChevronDown
            size={16}
            className={cn("text-[#404653] transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#404653]/30 rounded-[6px] shadow-lg overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
              <Search size={13} className="text-[#9aa0ad] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                className="flex-1 text-sm bg-transparent outline-none text-[#404653] placeholder:text-[#9aa0ad]"
              />
            </div>
          </div>
          {/* Options list */}
          <ul
            role="listbox"
            className="max-h-56 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[#9aa0ad] text-center">Nenhum resultado</li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt}
                  role="option"
                  aria-selected={opt === value}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer transition-colors",
                    opt === value
                      ? "bg-[#C2D82F]/20 text-[#404653] font-medium"
                      : "text-[#404653] hover:bg-[#C2D82F]/10"
                  )}
                >
                  {opt === "-" ? <span className="text-[#9aa0ad]">—</span> : opt}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
