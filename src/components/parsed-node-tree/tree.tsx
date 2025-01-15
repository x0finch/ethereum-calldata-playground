import { TreeNodeProps } from "./interfaces"
import { TreeNode } from "./node"

export function Tree({ root }: { root: TreeNodeProps }) {
  return (
    <div className="overflow-auto max-h-[60vh]">
      <TreeNode {...root} />
    </div>
  )
}
