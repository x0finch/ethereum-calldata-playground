"use client"

import { HistoryItem, useHistory } from "@/lib/hooks/use-history"
import { SELECTOR_LENGTH } from "@/lib/parse-calldata"
import { timeAgo } from "@/lib/utils"
import { Button } from "@shadcn/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shadcn/components/ui/popover"
import { ToastAction } from "@shadcn/components/ui/toast"
import { useToast } from "@shadcn/hooks/use-toast"
import { cn } from "@shadcn/lib/utils"
import { Trash } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useMemo, useState } from "react"

export function HistoryPopover({ children }: { children: ReactNode }) {
  const { history } = useHistory()
  const sortedHistories = useMemo(
    () => Object.values(history).sort((a, b) => b.updatedAt - a.updatedAt),
    [history]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="mr-10 w-96 max-h-96 overflow-y-auto bbbbbb">
        {sortedHistories.length <= 0 && <div>No History</div>}
        {sortedHistories.map((historyItem) => (
          <HistoryItemView key={historyItem.id} {...historyItem} />
        ))}
      </PopoverContent>
    </Popover>
  )
}

function HistoryItemView({ id, calldata, signatures, updatedAt }: HistoryItem) {
  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()
  const { deleteHistoryItem } = useHistory()
  const [isDeleting, setIsDeleting] = useState(false)
  const selector = calldata.slice(0, SELECTOR_LENGTH)
  const signature = signatures[selector]
  const functionName = signature
    ? signature.slice(0, signature.indexOf("("))
    : null
  const dataLength = calldata.length - SELECTOR_LENGTH
  const describe =
    dataLength <= 0 ? selector : `${selector}...(+${dataLength} more)`
  const updatedAtTimeAgo = timeAgo(updatedAt)
  const isSelected = pathname.includes(id)

  return (
    <Link
      href={`/calldata/${id}`}
      className={cn(
        "flex flex-col py-2 border-b cursor-pointer [&>*]:px-2 hover:bg-muted/50 hover:border-transparent hover:rounded-md group",
        isSelected && "bg-muted border-transparent rounded-md"
      )}
    >
      <div className="flex flex-row justify-between items-center">
        <span className={cn("font-bold", isDeleting && "line-through")}>
          {functionName ?? selector}
        </span>

        <Button
          id="remove-history-item"
          size="icon"
          variant="ghost"
          className="w-8 h-8 hover:text-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.preventDefault()

            setIsDeleting(true)

            const timer = setTimeout(() => {
              deleteHistoryItem(id)

              if (pathname.includes(id)) {
                router.push("/")
              }
            }, 3000)

            toast({
              title: "Removed",
              duration: 3000,
              action: (
                <ToastAction
                  altText="undo history item deleting"
                  onClick={() => {
                    clearTimeout(timer)
                    setIsDeleting(false)
                  }}
                >
                  Undo
                </ToastAction>
              ),
            })
          }}
        >
          <Trash />
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center">
        <span className="font-mono text-sm text-muted-foreground">
          {describe}
        </span>
        <span className="text-sm text-muted-foreground">
          {updatedAtTimeAgo}
        </span>
      </div>
    </Link>
  )
}
