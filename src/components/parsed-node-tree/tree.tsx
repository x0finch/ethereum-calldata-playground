import { TreeNodeProps } from "./interfaces"
import { TreeNode } from "./node"

export function Tree({ root }: { root: TreeNodeProps }) {
  return <TreeNode {...root} />
}
