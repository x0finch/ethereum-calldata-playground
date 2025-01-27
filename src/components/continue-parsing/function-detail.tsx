import { useToast } from "@shadcn/hooks/use-toast"
import { ChevronDown, ChevronRight } from "lucide-react"
import { isValidElement, ReactNode, useMemo, useState } from "react"
import { RichActionsTextField } from "../rich-actions-text-field"

export interface FunctionDetailParam {
  index?: string
  name: string
  value: string
  type: string
  children?: ReactNode | FunctionDetailParam[]
}

export interface FunctionDetailProps {
  name: string
  params: FunctionDetailParam[]
  onParamsChange: (params: FunctionDetailParam[]) => void
}

export function FunctionDetail({
  name,
  params,
  onParamsChange,
}: FunctionDetailProps) {
  const { toast } = useToast()
  const indexedParams = useMemo(() => {
    function wrapParams(
      params: FunctionDetailParam[],
      parentIndex: number | null
    ): FunctionDetailParam[] {
      return params.map((param, i) => {
        const index = parentIndex === null ? `${i}` : `${parentIndex}.${i}`

        if (param.children && !isValidElement(param.children)) {
          const children = wrapParams(
            param.children as FunctionDetailParam[],
            i
          )
          return { ...param, index, children }
        }

        return { ...param, index }
      })
    }

    return wrapParams(params, null)
  }, [params])

  const onParamChange = (index: string, value: string) => {
    function searchParam(
      params: FunctionDetailParam[],
      index: string
    ): FunctionDetailParam | null {
      const path = index.split(".").map(Number)

      let search: FunctionDetailParam | null = params[path[0]]

      for (let i = 1; i < path.length; ++i) {
        if (!search?.children || isValidElement(search.children)) {
          search = null
          break
        }

        search = (search.children as FunctionDetailParam[])[path[i]]
      }

      return search
    }

    const param = searchParam(indexedParams, index)
    if (!param) {
      toast({
        title: "Something went wrong",
        description: "Please refresh the page and try again",
      })
      return
    }

    param.value = value
    onParamsChange(indexedParams)
  }

  return (
    <div className="ml-5">
      <SimpleTree parent={<FunctionRow name={name} />}>
        {indexedParams.map((param) => (
          <li key={param.index}>
            <ParamRow {...param} onParamChange={onParamChange} />
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
  index,
  name,
  value,
  type,
  onParamChange,
}: FunctionDetailProps["params"][0] & {
  onParamChange: (index: string, value: string) => void
}) {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">{name ?? "unknown"}:</span>
      <RichActionsTextField
        className="mr-2 max-w-lg overflow-hidden text-ellipsis"
        value={value}
        onChange={(value) => index && onParamChange(index, value)}
      />
      <span className="text-sm bg-gray-200 rounded px-1">{type}</span>
    </div>
  )
}

function ParamRow({
  children,
  onParamChange,
  ...param
}: FunctionDetailProps["params"][0] & {
  onParamChange: (index: string, value: string) => void
}) {
  if (!children) {
    return <SimpleParamRow {...param} onParamChange={onParamChange} />
  }

  const isReactNode = isValidElement(children)

  return (
    <SimpleTree
      parent={<SimpleParamRow {...param} onParamChange={onParamChange} />}
    >
      {isReactNode ? (
        <li>{children}</li>
      ) : (
        (children as FunctionDetailParam[]).map((param, index) => (
          <li key={index}>
            <ParamRow {...param} onParamChange={onParamChange} />
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
