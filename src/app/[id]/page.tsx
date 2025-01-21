import { Panel } from "@/components/panel"

export default async function Detail(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  return <Panel id={params.id} />
}
