import { TreeNodeProps } from "@/components/parsed-node-tree"
import {
  decodeFunctionData,
  getAbiItem,
  Hex,
  Abi,
  parseAbi,
  AbiParameter,
} from "viem"

const METHOD_ID_LENGTH = 10 // include 0x prefix

export type ParsedCallData = {
  functionName: string
  params: {
    name: string
    type: string
    value: unknown
    parsed: (ParsedCallData | undefined)[]
  }[]
}

export function parseCalldata(
  abi: Abi,
  calldata: Hex
): ParsedCallData | undefined {
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
  const params = abiItem.inputs.map(({ name, type }, index) => {
    const value = parsed.args?.[index]
    // const values = [parsed.args?.[index]].flat()

    return {
      name: name ?? `${index}`,
      type,
      value: !Array.isArray(value)
        ? `${value}`
        : value.map((v, index) => {
            const subType = type.startsWith("tuple")
              ? ((abiItem as any)["components"] as AbiParameter[])[index].type
              : type.replace("[]", "")

            return {
              name: `${index}`,
              type: subType,
              value: `${v}`,
            }
          }),
      parsed: [value]
        .flat()
        .map((v) =>
          type.startsWith("bytes") &&
          typeof v === "string" &&
          v.startsWith("0x")
            ? parseCalldata(abi, v as Hex)
            : undefined
        ),
    }
  })

  // const params = abiItem.inputs.map(({ name, type, ...rest }, index) => {
  //   const value = parsed.args?.[index]
  //   const valueIsArray = Array.isArray(value)

  //   if (!Array.isArray(value)) {
  //     const sub =
  //       type === "bytes" && typeof value === "string" && value.startsWith("0x")
  //         ? parseCalldata(abi, value as Hex)
  //         : undefined

  //     return {
  //       name: name ?? `${index}`,
  //       type,
  //       value,
  //       parsed: sub ? [sub] : [],
  //     }
  //   }

  //   return {
  //     name: name ?? `${index}`,
  //     type,
  //     value: "",
  //     parsed: value.map((v, index) => {
  //       const subType = type.startsWith("tuple")
  //         ? ((rest as any)["components"] as AbiParameter[])[index].type
  //         : type.replace("[]", "")

  //       const sub =
  //         subType === "bytes" && typeof v === "string" && v.startsWith("0x")
  //           ? parseCalldata(abi, v as Hex)
  //           : undefined

  //       return {
  //         name: `${index}`,
  //         type: subType,
  //         value: v,
  //         parsed: sub ? [sub] : [],
  //       }
  //     }),
  //   }
  // })

  return {
    functionName,
    params,
  }
}

export function parseCalldata2(
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
  // const params = abiItem.inputs.map(({ name, type }, index) => {
  //   const value = parsed.args?.[index]
  //   // const values = [parsed.args?.[index]].flat()

  //   return {
  //     name: name ?? `${index}`,
  //     type,
  //     value: !Array.isArray(value)
  //       ? `${value}`
  //       : value.map((v, index) => {
  //           const subType = type.startsWith("tuple")
  //             ? ((abiItem as any)["components"] as AbiParameter[])[index].type
  //             : type.replace("[]", "")

  //           return {
  //             name: `${index}`,
  //             type: subType,
  //             value: `${v}`,
  //           }
  //         }),
  //     parsed: [value]
  //       .flat()
  //       .map((v) =>
  //         type.startsWith("bytes") &&
  //         typeof v === "string" &&
  //         v.startsWith("0x")
  //           ? parseCalldata(abi, v as Hex)
  //           : undefined
  //       ),
  //   }
  // })

  const nodes: TreeNodeProps["nodes"] = abiItem.inputs.map(
    ({ name, type, ...rest }, index) => {
      const value = parsed.args?.[index]
      const valueIsArray = Array.isArray(value)

      if (!Array.isArray(value)) {
        const node =
          type === "bytes" &&
          typeof value === "string" &&
          value.startsWith("0x")
            ? parseCalldata2(abi, value as Hex)
            : undefined

        return {
          // name: name ?? `${index}`,
          // type,
          // value,
          // parsed: sub ? [sub] : [],
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
              ? parseCalldata2(abi, v as Hex)
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
