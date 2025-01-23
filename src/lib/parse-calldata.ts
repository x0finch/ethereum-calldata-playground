import { TreeNodeProps } from "@/components/parsed-node-tree"
import { decodeFunctionData, getAbiItem, Hex, Abi, AbiParameter } from "viem"

export const METHOD_ID_LENGTH = 10 // include 0x prefix

export function parseCalldata(
  abi: Abi,
  calldata: Hex
): TreeNodeProps | undefined {
  const methodId = calldata.slice(0, METHOD_ID_LENGTH)
  if (methodId.length < METHOD_ID_LENGTH) {
    return undefined
  }

  const abiItem = getAbiItem({ abi, name: methodId })
  if (!abiItem || abiItem.type !== "function") {
    return undefined
  }

  type DecodeFunctionDataReturnType = ReturnType<typeof decodeFunctionData>
  let parsed: DecodeFunctionDataReturnType

  try {
    parsed = decodeFunctionData({
      abi,
      data: calldata,
    }) as DecodeFunctionDataReturnType
  } catch {
    return undefined
  }

  const functionName = parsed.functionName

  const nodes: TreeNodeProps["nodes"] = abiItem.inputs.map(
    ({ name, type, ...rest }, index) => {
      const value = parsed.args?.[index]

      if (!Array.isArray(value)) {
        const node =
          type === "bytes" &&
          typeof value === "string" &&
          value.startsWith("0x")
            ? parseCalldata(abi, value as Hex)
            : undefined

        return {
          variant: "field",
          name: name ?? `${index}`,
          type,
          value: `${value}`,
          nodes: node ? [node] : undefined,
        }
      }

      return {
        variant: "field",
        name: name ?? `${index}`,
        type,
        value: "",
        nodes: value.map((v, index) => {
          const subType = type.startsWith("tuple")
            ? ((rest as any)["components"] as AbiParameter[])[index].type
            : type.replace("[]", "")

          const sub =
            subType === "bytes" && typeof v === "string" && v.startsWith("0x")
              ? parseCalldata(abi, v as Hex)
              : undefined

          return {
            variant: "field",
            name: `${index}`,
            type: subType,
            value: `${v}`,
            nodes: sub ? [sub] : undefined,
          }
        }),
      }
    }
  )

  return {
    variant: "function",
    value: functionName,
    nodes,
  }
}
