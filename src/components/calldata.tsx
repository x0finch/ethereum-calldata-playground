import { zip } from "@/lib/zips"
import { Button } from "@shadcn/components/ui/button"
import { ScrollArea } from "@shadcn/components/ui/scroll-area"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Play, Share2 } from "lucide-react"
import React from "react"
import { Hex } from "viem"
import { ExecCalldataDialog } from "./exec-calldata-dialog"

export function Calldata({ calldata }: { calldata: string }) {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = React.useState(false)

  // const onItemClick = async (value: string) => {
  //   if (value === "copy") {
  //     copy(calldata)
  //     toast({
  //       title: "Copied!",
  //     })
  //   } else if (value === "play") {
  //     setOpenDialog(true)
  //   } else if (value === "share") {
  //     const url = new URL(window.location.href)
  //     const zipped = await zip(calldata as Hex)
  //     url.pathname = `/calldata/${zipped}`
  //     copy(url.toString())

  //     toast({
  //       title: "Copied Share Link!",
  //     })
  //   }
  // }

  const onCopyClick = () => {
    copy(calldata)
    toast({
      title: "Copied!",
    })
  }

  const onPlayClick = () => {
    setOpenDialog(true)
  }

  const onShareClick = async () => {
    const url = new URL(window.location.href)
    const zipped = await zip(calldata as Hex)
    url.pathname = `/calldata/${zipped}`
    copy(url.toString())

    toast({
      title: "Copied Share Link!",
    })
  }

  return (
    <div className="mb-4 w-[calc(100%+0.5rem)]">
      <ScrollArea className="h-28 pr-2">
        <div className="text-sm font-mono break-all text-muted-foreground">
          {calldata}
        </div>
      </ScrollArea>
      <div className="w-min mt-4 flex flex-row gap-2 ">
        <Button onClick={onCopyClick}>
          <Copy className="w-4 h-4" />
          Copy
        </Button>
        <Button onClick={onPlayClick} className="bg-green-400">
          <Play className="w-4 h-4" />
          Play
        </Button>
        <Button onClick={onShareClick} className="bg-blue-400">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      <ExecCalldataDialog
        calldata={calldata}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  )
}
