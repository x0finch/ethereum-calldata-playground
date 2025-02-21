import { Page } from "@/components/page"

export default async function HistoryItemPage(props: {
  params: Promise<{ historyId: string }>
}) {
  const params = await props.params
  return <Page historyId={params.historyId} />
}
