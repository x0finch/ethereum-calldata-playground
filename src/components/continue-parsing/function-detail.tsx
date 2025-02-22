import { useToast } from "@shadcn/hooks/use-toast"
import { cn } from "@shadcn/lib/utils"
import { Minus, Plus } from "lucide-react"
import { isValidElement, ReactNode, useMemo, useState } from "react"

export interface FunctionDetailParam {
  index?: string
  name: string
  value: string
  type: string
  children?: ReactNode | FunctionDetailParam[]
}

export interface FunctionDetailProps {
  name: ReactNode
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
    <SimpleTree parent={<FunctionRow name={name} />}>
      {indexedParams.length <= 0 && (
        <li>
          <div className="text-base italic">No Parameter</div>
        </li>
      )}
      {indexedParams.length > 0 &&
        indexedParams.map((param) => (
          <li key={param.index}>
            <ParamRow {...param} onParamChange={onParamChange} />
          </li>
        ))}
    </SimpleTree>
  )
}

function FunctionRow({ name }: Pick<FunctionDetailProps, "name">) {
  return <div className="font-bold text-lg max-w-full">{name}</div>
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
    <div className="flex items-center w-full overflow-clip">
      <span className="text-lg font-bold mr-3">{name ?? "unknown"}:</span>
      {/* <RichActionsTextField
        className="mr-2 font-mono text-lg overflow-clip text-ellipsis max-w-full"
        value={value}
        onChange={(value) => index && onParamChange(index, value)}
      /> */}
      <div className="font-mono text-lg overflow-clip text-ellipsis max-w-[calc(100%-100px)]">
        {value}
      </div>

      <span className="ml-2 text-sm bg-bg rounded px-1 font-mono">{type}</span>
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

/**
 * @deprecated
 */
function OpenFlag({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick?: () => void
}) {
  return (
    <div onClick={onClick} className="cursor-pointer mr-1 pt-1">
      {isOpen ? (
        <Minus className="w-6 h-6" strokeWidth={4} strokeLinecap="square" />
      ) : (
        <Plus className="w-6 h-6" strokeWidth={4} strokeLinecap="square" />
      )}
    </div>
  )
}

export function SimpleTree({
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
      <li
        className={cn("flex items-center cursor-pointer", !isOpen && "mb-2")}
        onClick={() => toggleOpen()}
      >
        {parent}
      </li>
      <li className="pl-[2px]">
        {isOpen && (
          <ul className="pl-6 py-2 border-l-4 border-border border-dotted mb-1">
            {children}
          </ul>
        )}
      </li>
    </ul>
  )
}
