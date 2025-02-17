"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { generateUUID } from "@/lib/utils"
import { unzip } from "@/lib/zips"
import { useToast } from "@shadcn/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CALLDATA_PATTERN } from "./searching"

export function CalldataPageRedirect({ calldata }: { calldata: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { createHistoryItem } = useHistory()

  useEffect(() => {
    async function handleCalldata(calldata: string) {
      if (!calldata.startsWith("0x")) {
        try {
          const unzipped = await unzip(calldata)
          calldata = unzipped
        } catch (err) {
          console.error("Failed to unzip calldata: ", err)
        }
      }

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
    }

    handleCalldata(calldata)
  }, [calldata])

  return <div>Redirecting...</div>
}
