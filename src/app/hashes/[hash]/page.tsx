import { HashPageRedirect } from "@/components/hash-page-redirect"
import { notFound } from "next/navigation"

const HASH_PATTERN = /^0x[a-fA-F0-9]{64}$/

export default async function HashPage(props: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await props.params

  if (!HASH_PATTERN.test(hash)) {
    return notFound()
  }

  return <HashPageRedirect hash={hash} />
}
