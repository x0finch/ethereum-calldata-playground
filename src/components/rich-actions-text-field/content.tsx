import { cn } from "@shadcn/lib/utils"
import React from "react"

interface ContentProps {
  children: string
  className?: string
}

export const Content = React.forwardRef(
  (
    { className, children, ...rest }: ContentProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "cursor-pointer hover:bg-muted-foreground/10 px-1",
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)
