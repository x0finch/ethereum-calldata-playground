"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { Badge } from "@shadcn/components/ui/badge"
import { Card, CardContent } from "@shadcn/components/ui/card"
import { cn } from "@shadcn/lib/utils"
import { Calldata } from "./calldata"
import { ContinueParsing } from "./continue-parsing"
import { useSelectedHistoryItem } from "./selected-history-provider"

export function Playground() {
  const { historyId, historyItem } = useSelectedHistoryItem()
  const {  updateCalldata } = useHistory()

  if (!historyItem) {
    return null
  }

  const { context, calldata } = historyItem
  const hasEdited = context && context?.calldata !== calldata

  return (
    <Card
      className={cn(
        "bg-bw border-4 flex flex-col px-6 py-4 overflow-auto relative min-w-0",
        hasEdited &&
          "border-yellow-500 shadow-yellow-500 shadow-[4px_4px_0px_0px]"
      )}
    >
      <CardContent className="p-0">
        <Calldata calldata={calldata} />
        <ContinueParsing
          historyId={historyId}
          calldata={calldata}
          onCallDataChange={(data) => updateCalldata(historyId, data)}
        />
        {hasEdited && (
          <div className="absolute bottom-0 right-0">
            <Badge
              className="bg-yellow-500 text-white border-none"
            >
              Edited
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
