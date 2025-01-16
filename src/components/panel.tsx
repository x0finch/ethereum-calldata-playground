import { DemoTree } from "./demo-tree"
import { ParsedTree, TreeNodeProps } from "./parsed-node-tree"

const FAKE_CALLDATA =
  "0xac9650d8000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000a40c49ccbe00000000000000000000000000000000000000000000000000000000000d7f720000000000000000000000000000000000000000000000000000000bb47d81850000000000000000000000000000000000000000000000000000000011f7723d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000067807d51000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000084fc6f786500000000000000000000000000000000000000000000000000000000000d7f720000000000000000000000002e8b488f7283cb4d7bd9c422d8b580cf30977ccb00000000000000000000000000000000ffffffffffffffffffffffffffffffff00000000000000000000000000000000ffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000"

const FAKE_PARSED: TreeNodeProps = {
  variant: "function",
  value: "transfer",
  nodes: [
    {
      variant: "field",
      type: "address",
      name: "from",
      value: "0x2E8b488f7283cB4D7BD9C422d8b580Cf30977cCb",
    },
    {
      variant: "field",
      type: "address",
      name: "to",
      value: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    },
    {
      variant: "field",
      type: "bytes32",
      name: "data",
      value: "0x00d7f720000000000000000000000002e8b488f7283cb4d7bd9c422d8b580c",
      nodes: [
        {
          variant: "function",
          value: "transferOwnership",
          nodes: [
            {
              variant: "field",
              type: "address",
              name: "signer",
              value: "0x2E8b488f7283cB4D7BD9C422d8b580Cf30977cCb",
            },
            {
              variant: "field",
              type: "address",
              name: "owner",
              value: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
            },
            {
              variant: "field",
              type: "uint256",
              name: "value",
              value: "100000000000000000000",
            },
          ],
        },
      ],
    },
  ],
}

export function Panel() {
  // <div className="overflow-auto max-h-[60vh]"></div>
  return (
    <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow overflow-auto pb-10">
      <div className="text-sm font-mono mb-4 overflow-hidden text-ellipsis text-muted-foreground">
        {FAKE_CALLDATA}
      </div>
      {/* <ParsedTree root={FAKE_PARSED} /> */}
      <DemoTree />
    </div>
  )
}
