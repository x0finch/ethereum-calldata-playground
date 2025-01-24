import {
  decodeFunctionData,
  getAbiItem,
  Hex,
  Abi,
  AbiParameter,
  AbiFunction,
  DecodeFunctionDataReturnType,
} from "viem"

export const METHOD_ID_LENGTH = 10 // include 0x prefix

interface Param {
  name: string
  value: string
  type: string
  children?: Param[]
}

export interface ParsedCalldata {
  name: string
  params: Param[]
}

export function parseCallData(data: string, abi: Abi): ParsedCalldata {
  const parsed = decodeFunctionData({ abi, data: data as Hex })
  const abiItem = getAbiItem({ abi, name: parsed.functionName }) as AbiFunction

  return {
    name: parsed.functionName,
    params: abiItem.inputs.map((param, index) =>
      parseAbiParameter(param, index, parsed)
    ),
  }
}

function parseAbiParameter(
  param: AbiParameter,
  index: number,
  parsed: DecodeFunctionDataReturnType<Abi>
): Param {
  const { type } = param
  const name = param.name ?? `${index}`
  const value = parsed.args?.[index] ?? null

  if (!Array.isArray(value)) {
    return { name, type, value: `${value}` }
  }

  return {
    name,
    type,
    value: "",
    children: value.map((v, index) => {
      const subType = type.startsWith("tuple")
        ? ((param as any)["components"] as AbiParameter[])?.[index]?.type
        : type.replace("[]", "")
      const value = `${v}`

      return {
        name: `${index}`,
        type: subType ?? "unknown",
        value,
      }
    }),
  }
}
