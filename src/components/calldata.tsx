"use client"

import { useHistory } from "@/store/history"
import { ContinueParsing } from "./continue-parsing"

export function Calldata({ id }: { id: string }) {
  const { history } = useHistory()
  const calldata = history[id]

  if (!calldata) {
    return null
  }

  const { data } = calldata

  return (
    <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow overflow-auto pb-10">
      <div className="text-sm font-mono mb-4 overflow-hidden text-ellipsis text-muted-foreground">
        {data}
      </div>
      <ContinueParsing data={data} onDataChnage={console.log} />
    </div>
  )
}
