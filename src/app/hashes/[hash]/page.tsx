import { serverFetcher } from "@/lib/utils"
import { notFound, redirect, RedirectType } from "next/navigation"

const HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/

export default async function HashPage(props: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await props.params

  if (!HASH_PATTERN.test(hash)) {
    return notFound()
  }

  const calldata: string | null = await serverFetcher(
    `/api/hashes/${hash}`
  ).catch((err) => {
    console.error("Error fetching calldata for hash", hash, err)
    return null
  })

  if (calldata) {
    return redirect(`/calldata/${calldata}`, RedirectType.replace)
  }

  return notFound()
}
