import { Button } from "@shadcn/components/ui/button"
import { Textarea } from "@shadcn/components/ui/textarea"
import { Check, X } from "lucide-react"
import { useState } from "react"

export function SolidityTypeSensitivedInput({
  value: initValue,
  onChange: onChangeSubmit,
  onCancel,
}: {
  value: string
  onChange: (value: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(initValue)

  return (
    <div className="flex flex-col mr-2">
      <Textarea
        className="w-96 h-20 mt-2 mb-2 text-2xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex flex-row items-center gap-2 self-end">
        <Button
          size="icon"
          className="hover:bg-emerald-500 hover:text-background"
          onClick={() => onChangeSubmit(value)}
        >
          <Check />
        </Button>
        <Button
          size="icon"
          className="hover:bg-destructive hover:text-background"
          onClick={onCancel}
        >
          <X />
        </Button>
      </div>
    </div>
  )
}
