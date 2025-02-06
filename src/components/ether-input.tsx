import { EthUnit, transformEthUnit } from "@/lib/utils"
import { Input } from "@shadcn/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/components/ui/select"
import { cn } from "@shadcn/lib/utils"
import React from "react"

const UNIT_OPTIONS: { label: string; value: EthUnit }[] = [
  { label: "ETH", value: "ether" },
  { label: "GWEI", value: "gwei" },
  { label: "WEI", value: "wei" },
]

const VALUE_PATTERN = /^(-?)([0-9]*)\.?([0-9]*)$/

export const EtherInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & {
    onValueChange: (value: string) => void
  }
>(({ className, onValueChange: onValueChangeProp, ...props }, ref) => {
  const [unit, setUnit] = React.useState<EthUnit>("ether")
  const [value, setValue] = React.useState<string>("0")

  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (VALUE_PATTERN.test(value)) {
      setValue(value)
    }

    const valueInWei = transformEthUnit(value, unit, "wei")
    onValueChangeProp(valueInWei)
  }

  const onUnitChange = (newUnit: EthUnit) => {
    const prevUnit = unit
    setUnit(newUnit)

    const transformedValue = transformEthUnit(value, prevUnit, newUnit)
    setValue(transformedValue)
    onValueChangeProp(transformedValue)
  }

  return (
    <div className={cn("flex items-center gap-2 relative", className)}>
      <Input
        className="pr-16"
        ref={ref}
        {...{
          ...props,
          value,
          onChange: onValueChange,
          type: "text",
          inputMode: "decimal",
          pattern: VALUE_PATTERN.source,
        }}
      />
      <UnitSelect value={unit} onChange={onUnitChange} />
    </div>
  )
})

function UnitSelect({
  value,
  onChange,
  className,
}: {
  value: EthUnit
  onChange: (value: EthUnit) => void
  className?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          className,
          "absolute right-2 size-min flex justify-center items-center py-0 px-2 rounded-md bg-foreground text-background [&>.lucide-chevron-down]:hidden"
        )}
      >
        <SelectValue>
          {UNIT_OPTIONS.find((option) => option.value === value)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {UNIT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
