import type { Address, Hex } from "viem"

export interface TxResponse {
  hash: Hex
  from: Address
  to: Address
  calldata: Hex
  value: Hex
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params

  try {
    const tx = await getTxFromTenderly(hash)
    if (tx) {
      const { hash, from, to, input: calldata, value } = tx
      return Response.json({ hash, from, to, calldata, value }, { status: 200 })
    }
  } catch {
    // do nothing
  }

  return new Response("Not found", { status: 404 })
}

interface TenderlyTransaction {
  hash: Hex
  from: Address
  to: Address
  input: Hex
  value: Hex
}

async function getTxFromTenderly(hash: string) {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10000)

  const response: { transactions: TenderlyTransaction[] } = await fetch(
    `https://api.tenderly.co/api/v1/search?query=${hash}&quickSearch=true`,
    { signal: abortController.signal }
  ).then((res) => res.json())

  clearTimeout(timeout)

  const tx = response.transactions?.find((tx) => tx.hash === hash)
  if (tx) {
    return tx
  }

  return null
}
