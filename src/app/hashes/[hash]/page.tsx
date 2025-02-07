"use client"

import { HashPageRedirect } from "@/components/hash-page-redirect"

export default async function HashPage(props: {
  params: Promise<{ hash: string }>
}) {
  const { hash } = await props.params
  return <HashPageRedirect hash={hash} />
}
