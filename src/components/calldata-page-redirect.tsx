"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { generateUUID } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CALLDATA_PATTERN } from "./searching-input"

export function CalldataPageRedirect({ calldata }: { calldata: string }) {
  const router = useRouter()
  const { createHistoryItem } = useHistory()

  useEffect(() => {
    const isCalldataValid = CALLDATA_PATTERN.test(calldata)

    if (!isCalldataValid) {
      router.replace("/")
      return
    }

    const id = generateUUID()
    createHistoryItem(id, calldata)
    router.replace(`/i/${id}`)
  }, [calldata])

  return <div>Redirecting...</div>
}
