"use client"

import { Input } from "@shadcn/components/ui/input"
import { Popover, PopoverAnchor } from "@shadcn/components/ui/popover"
import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"
import { Suggestions } from "./suggestions"

export const CALLDATA_PATTERN = /^0x[0-9a-fA-F]{8,}$/
const formSchema = z.object({
  search: z.string().refine((value) => CALLDATA_PATTERN.test(value), {
    message: "Invalid calldata",
  }),
})

export function Searching() {
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const handleClickInsideOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        searchRef.current.contains(event.target as Node)
      ) {
        const hasValue = searchRef.current.value !== ""
        setOpenSuggestions(hasValue)
      }
    }

    document.addEventListener("click", handleClickInsideOutside)
    return () => document.removeEventListener("click", handleClickInsideOutside)
  }, [])

  useEffect(() => {
    setOpenSuggestions(!!debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <Popover open={openSuggestions} onOpenChange={setOpenSuggestions}>
      <PopoverAnchor className="mb-12">
        <Input
          className="w-full h-16 border-4 p-2 md:p-4 rotate-1 text-sm md:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0"
          ref={searchRef}
          placeholder="Any Calldata or Transaction Hash"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </PopoverAnchor>
      <Suggestions searchTerm={debouncedSearchTerm} />
    </Popover>
  )
}
