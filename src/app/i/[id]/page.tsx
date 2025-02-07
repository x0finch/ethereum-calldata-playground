import { Playground } from "@/components/playground"

export default async function Detail(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  return <Playground id={params.id} />
}
