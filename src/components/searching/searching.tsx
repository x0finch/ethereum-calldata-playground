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
      <PopoverAnchor className="w-full max-w-4xl mb-8">
        <Input
          ref={searchRef}
          placeholder="Input any calldata or transaction hash here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </PopoverAnchor>
      <Suggestions searchTerm={debouncedSearchTerm} />
    </Popover>
  )
}
