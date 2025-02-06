"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { Calldata } from "./calldata"
import { ContinueParsing } from "./continue-parsing"

export function CalldataCard({ id }: { id: string }) {
  const { history, updateCalldata } = useHistory()
  const historyItem = history[id]

  if (!historyItem) {
    return null
  }

  const { calldata } = historyItem

  return (
    <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow overflow-auto pb-10">
      <Calldata calldata={calldata} />
      <ContinueParsing
        historyId={id}
        calldata={calldata}
        onCallDataChange={(data) => updateCalldata(id, data)}
      />
    </div>
  )
}
