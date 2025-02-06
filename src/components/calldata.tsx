import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Play } from "lucide-react"
import { ButtonGroup } from "./button-group"

export function Calldata({ calldata }: { calldata: string }) {
  const { toast } = useToast()

  const onItemClick = (value: string) => {
    if (value === "copy") {
      copy(calldata)
      toast({
        title: "Copied!",
      })
    } else if (value === "play") {
      console.log("play")
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
    </div>
  )
}
