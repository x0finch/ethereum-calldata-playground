import React, { useMemo } from "react"

interface ContentProps {
  children: string
  className?: string
}

export const Content = React.forwardRef(
  (
    { className, children, ...rest }: ContentProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const shortedChildren = useMemo(() => {
      if (children.length <= 80) {
        return children
      }

      const center = Math.floor(children.length / 2)
      const separator = Math.min(center, 40)
      return children.slice(0, separator) + "..." + children.slice(-separator)
    }, [children])

    return (
      <div ref={ref} className={className} {...rest}>
        {shortedChildren}
      </div>
    )
  }
)
