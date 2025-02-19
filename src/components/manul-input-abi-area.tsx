"use client"

import { tryParseHumanReadableAbi, tryParseJsonlikeAbi } from "@/lib/utils"
import { Button } from "@shadcn/components/ui/button"
import { Textarea } from "@shadcn/components/ui/textarea"
import { useToast } from "@shadcn/hooks/use-toast"
import { Check, Pointer, X } from "lucide-react"
import { useState } from "react"
import { Abi } from "viem"

async function tryParseAbi(input: string) {
  let abi = await tryParseJsonlikeAbi(input).catch(() => null)
  if (abi) {
    return abi
  }

  abi = await tryParseHumanReadableAbi(input).catch(() => null)
  if (abi) {
    return abi
  }

  return null
}

export function ManulInputAbiArea({
  onAbiSubmit,
}: {
  onAbiSubmit: (abi: Abi) => void
}) {
  const { toast } = useToast()
  const [inputHidden, setInputHidden] = useState(true)
  const [input, setInput] = useState("")

  const onSubmit = async () => {
    const trimmedInput = input.trim()

    if (!trimmedInput) {
      toast({
        title: "Please input ABI",
      })
      return
    }

    const abi = await tryParseAbi(trimmedInput)
    if (!abi) {
      toast({
        title: "Invalid ABI",
      })
      return
    }

    onAbiSubmit(abi)
  }

  return (
    <div
      className="w-full max-w-96 h-40 border-2 border-dashed rounded p-4 flex flex-col justify-center items-center cursor-pointer relative"
      onClick={() => inputHidden && setInputHidden(!inputHidden)}
    >
      {!inputHidden ? (
        <Textarea
          className="w-full h-full"
          placeholder="Please input ABI likes json format or function definition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-muted-foreground text-center">
            Sorry, we don't have ABI matching this calldata,
            <br />
            you can click here to input ABI manually
          </div>
          <Pointer className="text-muted-foreground/30 mt-2" />
        </div>
      )}
      {!inputHidden && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setInputHidden(true)}
          >
            <X className="w-4 h-4" color="red" />
          </Button>
          <Button variant="outline" size="icon" onClick={onSubmit}>
            <Check className="w-4 h-4" color="green" />
          </Button>
        </div>
      )}
    </div>
  )
}
