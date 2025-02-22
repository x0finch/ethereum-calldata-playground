"use client"

import { HistoryItem, useHistory } from "@/lib/hooks/use-history"
import { SELECTOR_LENGTH } from "@/lib/parse-calldata"
import { timeAgo } from "@/lib/utils"
import { Button } from "@shadcn/components/ui/button"
import { Card } from "@shadcn/components/ui/card"
import { ScrollArea } from "@shadcn/components/ui/scroll-area"
import { Skeleton } from "@shadcn/components/ui/skeleton"
import { ToastAction } from "@shadcn/components/ui/toast"
import { useToast } from "@shadcn/hooks/use-toast"
import { cn } from "@shadcn/lib/utils"
import { useMediaQuery } from "@uidotdev/usehooks"
import { Trash } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { useSelectedHistoryItem } from "./selected-history-provider"

export function HistoryList() {
  const { history } = useHistory()
  const sortedHistories = useMemo(
    () => Object.values(history).sort((a, b) => b.updatedAt - a.updatedAt),
    [history]
  )

  const hasHistory = sortedHistories.length > 0

  return (
    <Card className="w-full md:h-[600px] bg-bw border-4 mr-10">
      {!hasHistory && <NoHistory />}
      {hasHistory && <HistoryListContent histories={sortedHistories} />}
    </Card>
  )
}

function HistoryListSkeleton() {
  return (
    <div className="space-y-2 py-3 px-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="space-y-2 py-3 px-2" key={index}>
          <Skeleton className="h-5 sm:w-[150px] w-[100px]" />
          <Skeleton className="h-4 sm:w-[250px] w-[100px]" />
        </div>
      ))}
    </div>
  )
}

function NoHistory() {
  return (
    <div className="w-full h-full flex justify-center items-center text-2xl font-bold rotate-[6deg] py-12">
      Nothing
    </div>
  )
}

function HistoryListContent({ histories }: { histories: HistoryItem[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  const children = (
    <>
      {histories.map((historyItem) => (
        <HistoryItemView key={historyItem.id} {...historyItem} />
      ))}
    </>
  )

  return isMobile ? (
    <div className="flex flex-col gap-2">{children}</div>
  ) : (
    <ScrollArea className="h-max md:h-full">{children}</ScrollArea>
  )
}

function HistoryItemView({ id, calldata, signatures, updatedAt }: HistoryItem) {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const { toast } = useToast()
  const { historyId: selectedHistoryId } = useSelectedHistoryItem()
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

  const isSelected = selectedHistoryId === id

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setIsDeleting(true)

    const timer = setTimeout(() => {
      deleteHistoryItem(id)

      if (isSelected) {
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
  }

  return (
    <Link
      href={`/i/${id}`}
      className={cn(
        "flex flex-col px-4 py-2 cursor-pointer hover:bg-bg group max-w-full",
        isSelected && "bg-main hover:bg-main",
        isDeleting && "hidden"
      )}
    >
      <div className="flex flex-row items-center">
        <div className="font-bold overflow-hidden text-ellipsis max-w-[calc(100%-50px)]">
          {functionName ?? selector}
        </div>
        <div className="flex-1" />

        <Button
          id="remove-history-item"
          size="icon"
          variant="neutral"
          className={cn(
            "w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 ml-4",
            isMobile && "opacity-100"
          )}
          onClick={onDelete}
        >
          <Trash />
        </Button>
      </div>
      <div className="flex flex-row justify-between items-center mt-1">
        <span className="font-mono text-sm text-muted-foreground">
          {describe}
        </span>
        <span className="text-sm text-muted-foreground pr-1">
          {updatedAtTimeAgo}
        </span>
      </div>
    </Link>
  )
}
