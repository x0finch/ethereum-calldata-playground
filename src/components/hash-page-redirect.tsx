"use client"

import type { TxResponse } from "@/app/api/hashes/[hash]/route"
import { useHistory } from "@/lib/hooks/use-history"
import { fetcher, generateUUID } from "@/lib/utils"
import { useToast } from "@shadcn/hooks/use-toast"
import { useQuery } from "@tanstack/react-query"
import { notFound, useRouter } from "next/navigation"
import { useEffect } from "react"

export function HashPageRedirect({ hash }: { hash: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { createHistoryItem } = useHistory()

  const { data: tx, isLoading } = useQuery<TxResponse>({
    queryKey: ["hashes", hash],
    queryFn: ({ signal }) => fetcher(`/api/hashes/${hash}`, { signal }),
    retry: false,
  })

  useEffect(() => {
    if (!tx?.calldata) {
      return
    }

    const id = generateUUID()
    createHistoryItem(id, tx.calldata, tx)
    router.replace(`/i/${id}`)
  }, [tx])

  if (!isLoading && !tx?.calldata) {
    return notFound()
  }

  return <div>Redirecting...</div>
}
