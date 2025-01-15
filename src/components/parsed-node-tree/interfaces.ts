export type TreeNodeVariant = "function" | "field"

export interface TreeNodeProps {
  variant: TreeNodeVariant
  value: string
  name?: string
  type?: string
  nodes?: TreeNodeProps[]
}