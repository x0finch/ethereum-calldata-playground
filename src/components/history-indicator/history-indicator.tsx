import { Button } from "@shadcn/components/ui/button"
import { History } from "lucide-react"
import { HistoryPopover } from "./history-popover"

export function HistoryIndicator() {
  return (
    <HistoryPopover>
      <Button
        size="icon"
        variant="outline"
        className="absolute top-10 right-10"
      >
        <History />
      </Button>
    </HistoryPopover>
  )
}
