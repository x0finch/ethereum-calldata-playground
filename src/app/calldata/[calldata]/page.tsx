import { CalldataPageRedirect } from "@/components/calldata-page-redirect"

export default async function CalldataPage(props: {
  params: Promise<{ calldata: string }>
}) {
  const { calldata } = await props.params
  return <CalldataPageRedirect calldata={calldata} />
}
