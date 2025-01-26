import { cn } from "@shadcn/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { isValidElement, ReactNode, useState } from "react"
import { RichActionsTextField } from "../rich-actions-text-field"

interface Param {
  name: string
  value: string
  type: string
  children?: ReactNode | Param[]
}

export interface FunctionDetailProps {
  name: string
  params: Param[]
}

export function FunctionDetail({ name, params }: FunctionDetailProps) {
  return (
    <div className="ml-5">
      <SimpleTree parent={<FunctionRow name={name} />}>
        {params.map((param, index) => (
          <li key={index}>
            <ParamRow {...param} />
          </li>
        ))}
      </SimpleTree>
    </div>
  )
}

function FunctionRow({ name }: Pick<FunctionDetailProps, "name">) {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">{name}</span>
      <span className="text-sm text-muted-foreground">function</span>
    </div>
  )
}

function SimpleParamRow({
  name,
  value,
  type,
}: FunctionDetailProps["params"][0]) {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">{name ?? "unknown"}:</span>
      <RichActionsTextField
        className="mr-2 max-w-lg overflow-hidden text-ellipsis"
        value={value}
        onChange={() => {}}
      />
      <span className="text-sm bg-gray-200 rounded px-1">{type}</span>
    </div>
  )
}

function ParamRow({
  name,
  value,
  type,
  children,
}: FunctionDetailProps["params"][0]) {
  if (!children) {
    return <SimpleParamRow name={name} value={value} type={type} />
  }

  const isReactNode = isValidElement(children)

  return (
    <SimpleTree
      parent={<SimpleParamRow name={name} value={value} type={type} />}
    >
      {isReactNode ? (
        <li>{children}</li>
      ) : (
        (children as Param[]).map((param, index) => (
          <li key={index}>
            <ParamRow {...param} />
          </li>
        ))
      )}
    </SimpleTree>
  )
}

function Chevron({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} className="cursor-pointer mr-1 pt-1">
      {isOpen ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </div>
  )
}

function SimpleTree({
  parent,
  children,
}: {
  parent: ReactNode
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(true)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <ul>
      <li className="flex items-center cursor-default -ml-5">
        <Chevron isOpen={isOpen} onClick={toggleOpen} />
        {parent}
      </li>
      {isOpen && <ul className="mt-1 -ml-3 border-l pl-8">{children}</ul>}
    </ul>
  )
}
