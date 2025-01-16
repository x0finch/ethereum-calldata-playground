"use client"

import {
  parseCalldata,
  parseCalldata2,
  ParsedCallData,
} from "@/lib/parse-calldata"
import { ParsedTree, TreeNodeProps, TreeNodeVariant } from "./parsed-node-tree"
import { parseAbi } from "viem"

const abi = parseAbi([
  "function multicall(bytes[] data)",
  "function mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
  "function collect((uint256,address,uint128,uint128))",
  "function decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))",
])
// const parsedCallData = parseCalldata2(
//   abi,
//   "0x883164560000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000010d1000000000000000000000000000000000000000000000000000000000000111840000000000000000000000000000000000000000000000000000000006001e9100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b0a96600000000000000000000000000000000000000000000000000000000000000000000000000000000000000002e8b488f7283cb4d7bd9c422d8b580cf30977ccb0000000000000000000000000000000000000000000000000000000067892fc7"
// )
const parsedCallData = parseCalldata2(
  abi,
  "0xac9650d8000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000a40c49ccbe00000000000000000000000000000000000000000000000000000000000de0920000000000000000000000000000000000000000000000000000000fccbc81cf000000000000000000000000000000000000000000000000000000000599577e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000067892f5c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084fc6f786500000000000000000000000000000000000000000000000000000000000de0920000000000000000000000002e8b488f7283cb4d7bd9c422d8b580cf30977ccb00000000000000000000000000000000ffffffffffffffffffffffffffffffff00000000000000000000000000000000ffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000"
)

console.log("parsedCallData", JSON.stringify(parsedCallData))

function mapping(calldata: ParsedCallData | undefined): TreeNodeProps | null {
  if (!calldata) return null

  return {
    variant: "function",
    value: calldata.functionName,
    nodes: calldata.params
      .map(({ name, type, value, parsed }) => {
        return [value].flat().map((v, index) => {
          const subnode = parsed[index] ? mapping(parsed[index]) : null

          return {
            variant: "field" as TreeNodeVariant,
            name,
            type,
            value: `${v}`,
            nodes: subnode ? [subnode] : undefined,
          }
        })

        // if (!Array.isArray(value)) {
        //   const subnode = parsed[0] ? mapping(parsed[0]) : null

        //   return {
        //     variant: "field",
        //     name,
        //     type,
        //     value,
        //     nodes: subnode ? [subnode] : undefined,
        //   }
        // }

        // const subnodes = parsed ? mapping(parsed) : null

        // return {
        //   variant: "field",
        //   name,
        //   type,
        //   value,
        //   nodes: subnode ? [subnode] : undefined,
        // }
      })
      .flat(),
  }
}

// const root = mapping(parsedCallData)
const root = parsedCallData

export function DemoTree() {
  return root ? <ParsedTree root={root} /> : null
}
