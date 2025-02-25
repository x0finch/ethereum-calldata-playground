import {
  Abi,
  AbiFunction,
  AbiParameter,
  decodeFunctionData,
  DecodeFunctionDataReturnType,
  getAbiItem,
  Hex,
} from "viem"

export const SELECTOR_LENGTH = 10 // include 0x prefix

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

const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
)
const BN_ZERO = BigInt(0)

export type MultiSendTransaction = {
  toAddress: string
  value: bigint
  calldata: string
}

export function parseGnosisSafeMultiSend(data: string): MultiSendTransaction[] {
  const transactions: MultiSendTransaction[] = []

  if (data.startsWith("0x")) {
    data = data.slice(2)
  }

  let offset = 0
  while (offset < data.length) {
    const _operation = data.slice(offset, (offset += 1 * 2))
    const toAddress = data.slice(offset, (offset += 20 * 2))
    const value = data.slice(offset, (offset += 32 * 2))
    const valueBN = BigInt(`0x${value}`)

    const dataLength = data.slice(offset, (offset += 32 * 2))
    const dataLengthN = Number(BigInt(`0x${dataLength}`))
    const calldata =
      dataLengthN > 0 ? data.slice(offset, (offset += dataLengthN * 2)) : ""

    const isAddressValid = toAddress.length === 40
    const isValueValid = valueBN >= BN_ZERO && valueBN <= MAX_UINT256
    const isCalldataValid = calldata.length === dataLengthN * 2

    if (!isAddressValid || !isValueValid || !isCalldataValid) {
      throw new Error("Invalid multi-send transaction")
    }

    transactions.push({
      value: valueBN,
      toAddress: `0x${toAddress}`,
      calldata: `0x${calldata}`,
    })
  }

  return transactions
}
