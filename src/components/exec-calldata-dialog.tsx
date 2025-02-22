import { Button } from "@shadcn/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/components/ui/dialog"
import { Input } from "@shadcn/components/ui/input"
import { Label } from "@shadcn/components/ui/label"
import { useToast } from "@shadcn/hooks/use-toast"
import { cn } from "@shadcn/lib/utils"
import { ConnectKitButton } from "connectkit"
import React from "react"
import { Hex, isAddress } from "viem"
import { useAccount, useSendTransaction } from "wagmi"
import { EtherInput } from "./ether-input"

export function ExecCalldataDialog({
  calldata,
  open,
  onOpenChange,
}: {
  calldata: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [contractAddress, setContractAddress] = React.useState<string>("")
  const [value, setValue] = React.useState<string>("0")
  const isContractAddressValid = React.useMemo(() => {
    return isAddress(contractAddress)
  }, [contractAddress])

  const { isConnected } = useAccount()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Execute Calldata</DialogTitle>
          <DialogDescription>
            Execute the calldata with contract
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Contract</Label>
            <Input
              className={cn(
                "col-span-3",
                contractAddress &&
                  !isContractAddressValid &&
                  "border-destructive"
              )}
              placeholder="Please enter contract address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Value</Label>
            <EtherInput
              className="col-span-3"
              value={value}
              onValueChange={setValue}
            />
          </div>
        </div>
        <DialogFooter>
          {isConnected ? (
            <ExecuteButton
              contractAddress={contractAddress}
              value={value}
              calldata={calldata}
              disabled={!isContractAddressValid}
            />
          ) : (
            <ConnectButton />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConnectButton() {
  return (
    <ConnectKitButton.Custom>
      {({ show }) => <Button onClick={show}>Connect</Button>}
    </ConnectKitButton.Custom>
  )
}

function ExecuteButton({
  contractAddress,
  value,
  calldata,
  disabled,
}: {
  contractAddress: string
  value: string
  calldata: string
  disabled?: boolean
}) {
  const { sendTransactionAsync } = useSendTransaction()
  const { toast } = useToast()
  const [isExecuting, setIsExecuting] = React.useState(false)

  const onExecute = async () => {
    setIsExecuting(true)

    try {
      const txHash = await sendTransactionAsync({
        to: contractAddress as Hex,
        value: BigInt(value),
        data: calldata as Hex,
      })

      toast({
        title: "Transaction sent",
        description: `Transaction hash: ${txHash}`,
      })
    } catch (error) {
      console.error(`Failed to send transaction: `, error)
      toast({
        title: "Transaction failed",
        description: `Failed to send transaction`,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <Button onClick={onExecute} disabled={isExecuting || disabled}>
      {isExecuting ? "Executing..." : "Execute"}
    </Button>
  )
}
