"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { generateUUID } from "@/lib/utils"
import { useToast } from "@shadcn/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CALLDATA_PATTERN } from "./searching-input"

export function CalldataPageRedirect({ calldata }: { calldata: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { createHistoryItem } = useHistory()

  useEffect(() => {
    const isCalldataValid = CALLDATA_PATTERN.test(calldata)

    if (!isCalldataValid) {
      toast({
        title: "Invalid calldata",
        description: "Please enter a valid calldata",
      })
      router.replace("/")
      return
    }

    const id = generateUUID()
    createHistoryItem(id, calldata)
    router.replace(`/i/${id}`)
  }, [calldata])

  return <div>Redirecting...</div>
}
