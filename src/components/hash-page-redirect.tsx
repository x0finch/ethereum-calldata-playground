"use client"

import { fetcher } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { notFound } from "next/navigation"
import { CalldataPageRedirect } from "./calldata-page-redirect"

export function HashPageRedirect({ hash }: { hash: string }) {
  const {
    data: calldata,
    isLoading,
    isError,
    ...rest
  } = useQuery({
    queryKey: ["hashes", hash],
    queryFn: () => fetcher(`/api/hashes/${hash}`),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!calldata) {
    return notFound()
  }

  return <CalldataPageRedirect calldata={calldata} />
}
