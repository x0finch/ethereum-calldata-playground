"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { Badge } from "@shadcn/components/ui/badge"
import { cn } from "@shadcn/lib/utils"
import { Calldata } from "./calldata"
import { ContinueParsing } from "./continue-parsing"

export function CalldataCard({ id }: { id: string }) {
  const { history, updateCalldata } = useHistory()
  const historyItem = history[id]

  if (!historyItem) {
    return null
  }

  const { context, calldata } = historyItem
  const hasEdited = context && context?.calldata !== calldata

  return (
    <div className="flex flex-col relative w-full max-w-4xl">
      <div
        className={cn(
          " bg-white p-4 rounded-lg shadow overflow-auto pb-10",
          hasEdited && "border-2 border-yellow-500 shadow-none"
        )}
      >
        <Calldata calldata={calldata} />
        <ContinueParsing
          historyId={id}
          calldata={calldata}
          onCallDataChange={(data) => updateCalldata(id, data)}
        />
      </div>
      {hasEdited && (
        <div className="absolute bottom-0 right-0">
          <Badge
            variant="outline"
            className="bg-yellow-500 text-white border-none"
          >
            Edited
          </Badge>
        </div>
      )}
    </div>
  )
}
