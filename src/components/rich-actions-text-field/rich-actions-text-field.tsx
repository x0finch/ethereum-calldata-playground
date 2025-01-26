import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { useState } from "react"
import { Actions } from "./actions"
import { Content } from "./content"
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
