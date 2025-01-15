import { TreeNodeProps } from "./interfaces"

function NodeValue$Function({ value }: TreeNodeProps) {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">{value}</span>
      <span className="text-sm text-gray-500">function</span>
    </div>
  )
}

function NodeValue$Filed({ type, name, value }: TreeNodeProps) {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">{name ?? "unknown"}:</span>
      <span className="mr-2 max-w-5xl overflow-hidden text-ellipsis">
        {value}
      </span>
      <span className="text-sm bg-gray-200 rounded px-1">{type}</span>
    </div>
  )
}

export function NodeValue(props: TreeNodeProps) {
  switch (props.variant) {
    case "function":
      return <NodeValue$Function {...props} />
    case "field":
      return <NodeValue$Filed {...props} />
  }
}
