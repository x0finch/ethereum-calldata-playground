import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Play } from "lucide-react"
import React from "react"
import { ButtonGroup } from "./button-group"
import { ExecCalldataDialog } from "./exec-calldata-dialog"

export function Calldata({ calldata }: { calldata: string }) {
  const { toast } = useToast()
  const [openDialog, setOpenDialog] = React.useState(false)

  const onItemClick = (value: string) => {
    if (value === "copy") {
      copy(calldata)
      toast({
        title: "Copied!",
      })
    } else if (value === "play") {
      setOpenDialog(true)
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
      </ButtonGroup>

      <ExecCalldataDialog
        calldata={calldata}
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  )
}
