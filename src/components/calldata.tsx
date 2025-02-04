"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { ContinueParsing } from "./continue-parsing"

export function Calldata({ id }: { id: string }) {
  const { history, updateCalldata } = useHistory()
  const historyItem = history[id]

  if (!historyItem) {
    return null
  }

  const { calldata } = historyItem

  return (
    <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow overflow-auto pb-10">
      <div className="text-sm font-mono mb-4 overflow-hidden text-ellipsis text-muted-foreground">
        {calldata}
      </div>
      <ContinueParsing
        historyId={id}
        calldata={calldata}
        onCallDataChange={(data) => updateCalldata(id, data)}
      />
    </div>
  )
}
