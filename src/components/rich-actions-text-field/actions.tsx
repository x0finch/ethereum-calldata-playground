import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Pencil } from "lucide-react"
import { ButtonGroup } from "../button-group"

export function Actions({
  value: calldata,
  onEdit,
}: {
  value: string
  onEdit: () => void
}) {
  const { toast } = useToast()

  const onItemClick = (value: string) => {
    if (value === "copy") {
      copy(calldata)
      toast({
        title: "Copied!",
      })
    } else if (value === "edit") {
      onEdit()
    }
  }

  return (
    <ButtonGroup onItemClick={onItemClick}>
      <Button value="copy">
        <Copy />
      </Button>
      <Button value="edit">
        <Pencil />
      </Button>
    </ButtonGroup>
  )
}
