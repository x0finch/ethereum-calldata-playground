export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params

  try {
    const calldata = await getCalldataFromTenderly(hash)
    if (calldata) {
      return new Response(calldata, { status: 200 })
    }
  } catch {
    // do nothing
  }

  return new Response("Not found", { status: 404 })
}

interface TenderlyTransaction {
  hash: string
  input: string
}

async function getCalldataFromTenderly(hash: string) {
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10000)

  const response: { transactions: TenderlyTransaction[] } = await fetch(
    `https://api.tenderly.co/api/v1/search?query=${hash}&quickSearch=true`,
    { signal: abortController.signal }
  ).then((res) => res.json())

  clearTimeout(timeout)

  return response.transactions?.find((tx) => tx.hash === hash)?.input
}
