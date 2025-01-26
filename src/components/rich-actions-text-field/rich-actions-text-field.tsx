import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip"
import { Button } from "@shadcn/components/ui/button"
import { cn } from "@shadcn/lib/utils"
import { Copy, Pencil } from "lucide-react"
import copy from "copy-to-clipboard"
import { useToast } from "@shadcn/hooks/use-toast"
import { Actions } from "./actions"
import { Content } from "./content"
import { useState } from "react"
import { SolidityTypeSensitivedInput } from "./solidity-type-Sensitived-input"

interface RichActionsTextFieldProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichActionsTextField({
  value,
  onChange,
  className,
}: RichActionsTextFieldProps) {
  const [editingKey, setEditingKey] = useState(0)
  const isEditing = editingKey !== 0

  return (
    <Popover open={isEditing ? false : undefined}>
      <PopoverTrigger asChild>
        {isEditing ? (
          <SolidityTypeSensitivedInput
            key={editingKey}
            value={value}
            onChange={(value) => {
              onChange(value)
              setEditingKey(0)
            }}
            onCancel={() => setEditingKey(0)}
          />
        ) : (
          <Content className={className}>{value}</Content>
        )}
      </PopoverTrigger>
      <PopoverContent side="top">
        <Actions value={value} onEdit={() => setEditingKey(Date.now())} />
      </PopoverContent>
    </Popover>
  )
}
