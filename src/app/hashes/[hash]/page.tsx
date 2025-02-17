import { serverFetcher } from "@/lib/utils"
import { zip } from "@/lib/zips"
import { notFound, redirect, RedirectType } from "next/navigation"
import { Hex } from "viem"

const HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/

export default async function HashPage(props: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await props.params

  if (!HASH_PATTERN.test(hash)) {
    return notFound()
  }

  const tx: { input: string } | null = await serverFetcher(
    `/api/hashes/${hash}`
  ).catch((err) => {
    console.error("Error fetching tx for hash", hash, err)
    return null
  })

  if (tx?.input) {
    const zipped = await zip(tx.input as Hex)
    return redirect(`/calldata/${zipped}`, RedirectType.replace)
  }

  return notFound()
}
