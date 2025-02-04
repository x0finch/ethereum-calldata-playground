"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { Button } from "@shadcn/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shadcn/components/ui/popover"
import { ToastAction } from "@shadcn/components/ui/toast"
import { useToast } from "@shadcn/hooks/use-toast"
import { X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useMemo } from "react"

export function HistoryPopover({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()
  const { history, deleteHistoryItem } = useHistory()
  const sortedHistories = useMemo(
    () => Object.values(history).sort((a, b) => b.updatedAt - a.updatedAt),
    [history]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mr-10 max-h-96 overflow-y-auto">
        {sortedHistories.length <= 0 && <div>No History</div>}
        {sortedHistories.map((historyItem) => (
          <Link
            href={`/calldata/${historyItem.id}`}
            key={historyItem.id}
            className="flex flex-col border-b py-1 cursor-pointer [&>*]:px-2 relative group"
          >
            <span>doSomething</span>
            <span className="max-w-full text-sm font-mono text-muted-foreground overflow-clip text-ellipsis">
              {historyItem.calldata.slice(0, 10)}
            </span>
            <Button
              id="remove-history-item"
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0 w-8 h-8 hover:text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => {
                e.preventDefault()

                const timer = setTimeout(() => {
                  deleteHistoryItem(historyItem.id)
                  if (pathname.includes(historyItem.id)) {
                    router.push("/")
                  }
                }, 3000)

                toast({
                  title: "Removed",
                  duration: 3000,
                  action: (
                    <ToastAction
                      altText="put back history item"
                      onClick={() => clearTimeout(timer)}
                    >
                      Put back
                    </ToastAction>
                  ),
                })
              }}
            >
              <X />
            </Button>
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  )
}
