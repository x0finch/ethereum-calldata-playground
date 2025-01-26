import { ToggleGroup } from "@radix-ui/react-toggle-group"
import { Button } from "@shadcn/components/ui/button"
import { useToast } from "@shadcn/hooks/use-toast"
import copy from "copy-to-clipboard"
import { Copy, Pencil } from "lucide-react"

export function Actions({
  value,
  onEdit,
}: {
  value: string
  onEdit: () => void
}) {
  const { toast } = useToast()

  const onCopy = () => {
    copy(value)
    toast({
      title: "Copied!",
    })
  }

  return (
    <ToggleGroup
      type="single"
      className="rounded-md overflow-clip text-background [&>button]:bg-foreground [&>button]:rounded-none [&>button]:w-8 [&>button]:h-8"
    >
      <Button size="icon" variant="ghost" onClick={onCopy}>
        <Copy />
      </Button>
      <Button size="icon" variant="ghost" onClick={onEdit}>
        <Pencil />
      </Button>
    </ToggleGroup>
  )
}
