import { zip } from "@/lib/zips"
import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Play, Share2 } from "lucide-react"
import React from "react"
import { Hex } from "viem"
import { ButtonGroup } from "./button-group"
import { ExecCalldataDialog } from "./exec-calldata-dialog"

export function Calldata({ calldata }: { calldata: string }) {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = React.useState(false)

  const onItemClick = async (value: string) => {
    if (value === "copy") {
      copy(calldata)
      toast({
        title: "Copied!",
      })
    } else if (value === "play") {
      setOpenDialog(true)
    } else if (value === "share") {
      const url = new URL(window.location.href)
      const zipped = await zip(calldata as Hex)
      url.pathname = `/calldata/${zipped}`
      copy(url.toString())

      toast({
        title: "Copied Share Link!",
      })
    }
  }

  return (
    <div className="flex flex-row items-center mb-4">
      <span className="text-sm font-mono overflow-hidden text-ellipsis text-muted-foreground">
        {calldata}
      </span>
      <ButtonGroup onItemClick={onItemClick}>
        <Button value="copy">
          <Copy className="w-4 h-4" />
        </Button>
        <Button value="play">
          <Play className="w-4 h-4" />
        </Button>
        <Button value="share">
          <Share2 className="w-4 h-4" />
        </Button>
      </ButtonGroup>

      <ExecCalldataDialog
        calldata={calldata}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  )
}
