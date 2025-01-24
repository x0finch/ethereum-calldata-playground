import { SELECTOR_LENGTH } from "@/lib/parse-calldata"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ selector: string }> }
) {
  const { selector } = await params
  if (selector?.length !== SELECTOR_LENGTH || !selector.startsWith("0x")) {
    return new Response("Bad request", { status: 400 })
  }

  const functions = await proxyToOpenChain(selector as string)
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

async function proxyToOpenChain(selector: string) {
  const response: OpenChainLookupResponse = await fetch(
    `https://api.openchain.xyz/signature-database/v1/lookup?function=${selector}&filter=true`
  ).then((res) => res.json())

  return response.result.function[selector]?.map((item) => item.name) ?? []
}
