"use client"

import { parseCalldata } from "@/lib/parse-calldata"
import { ParsedTree } from "./parsed-node-tree"
import { Hex, parseAbi } from "viem"
import { useMemo } from "react"

const abi = parseAbi([
  "function multicall(bytes[] data)",
  "function mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
  "function collect((uint256,address,uint128,uint128))",
  "function decreaseLiquidity((uint256,uint128,uint256,uint256,uint256))",
])

export function ConnectedTree({ data }: { data: string }) {
  const rootNode = useMemo(() => parseCalldata(abi, data as Hex), [data])

  if (!rootNode) {
    return null
  }

  return <ParsedTree root={rootNode} />
}
