"use client"

import { useState } from "react"
import { NodeValue } from "./value"
import { TreeNodeProps } from "./interfaces"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@shadcn/lib/utils"

function Chevron({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {isOpen ? (
        <ChevronDown className="w-4 h-4 mr-1" />
      ) : (
        <ChevronRight className="w-4 h-4 mr-1" />
      )}
    </div>
  )
}

export function TreeNode(props: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true)
  const hasNodes = props.nodes?.length
  const toggleOpen = hasNodes ? () => setIsOpen((prev) => !prev) : undefined

  return (
    <ul>
      <li
        className={cn("flex items-center cursor-default", !hasNodes && "ml-5")}
      >
        {hasNodes && <Chevron isOpen={isOpen} onClick={toggleOpen} />}
        <NodeValue {...props} />
      </li>
      {isOpen && hasNodes && (
        <div className="mt-1 ml-2 border-l pl-2">
          {props.nodes!.map((node, index) => (
            <TreeNode key={index} {...node} />
          ))}
        </div>
      )}
    </ul>
  )
}
