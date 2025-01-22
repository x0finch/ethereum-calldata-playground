export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const functions = await proxyToOpenChain(id as string)

  if (!functions.length) {
    return new Response("Not found", { status: 404 })
  }

  return Response.json(functions, { status: 200 })
}

interface OpenChainLookupResponse {
  ok: boolean
  result: {
    function: {
      [id: string]: { name: string; filtered: boolean }[]
    }
  }
}

async function proxyToOpenChain(id: string) {
  const response: OpenChainLookupResponse = await fetch(
    `https://api.openchain.xyz/signature-database/v1/lookup?function=${id}&filter=true`
  ).then((res) => res.json())

  return response.result.function[id]?.map((item) => item.name) ?? []
}
