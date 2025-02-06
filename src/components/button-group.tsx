import {
  ToggleGroup,
  ToggleGroupItem,
} from "@shadcn/components/ui/toggle-group"
import { cn } from "@shadcn/lib/utils"

export function ButtonGroup({
  children,
  className,
  onItemClick,
}: {
  children: React.ReactNode
  className?: string
  onItemClick?: (value: string) => void
}) {
  const wrappedChildren = Array.isArray(children)
    ? children.map((child) => (
        <ToggleGroupItem
          key={child.props.value}
          value={child.props.value}
          asChild
          className="min-w-[unset] h-[inherit]"
        >
          {child}
        </ToggleGroupItem>
      ))
    : children

  return (
    <ToggleGroup
      type="single"
      value=""
      className={cn(
        "rounded-lg overflow-clip text-background gap-0",
        "[&>button]:rounded-none [&>button]:w-8 [&>button]:h-8 [&>button]:bg-foreground",
        className
      )}
      onValueChange={(value) => onItemClick?.(value)}
    >
      {wrappedChildren}
    </ToggleGroup>
  )
}
