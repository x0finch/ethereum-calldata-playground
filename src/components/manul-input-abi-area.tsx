"use client"

import { tryParseHumanReadableAbi, tryParseJsonlikeAbi } from "@/lib/utils"
import { Button } from "@shadcn/components/ui/button"
import { Textarea } from "@shadcn/components/ui/textarea"
import { useToast } from "@shadcn/hooks/use-toast"
import { Check, X } from "lucide-react"
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
      className="max-w-96 h-36 relative"
      onClick={() => inputHidden && setInputHidden(!inputHidden)}
    >
      {!inputHidden ? (
        <Textarea
          className="w-full h-full max-w-full max-h-full"
          placeholder={`Please input ABI likes:
1. Json Array Format
2. Human Readable Function Definition`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      ) : (
        <div className="h-full w-full flex flex-col justify-center items-center cursor-pointer border-4 border-dashed">
          <div className="text-sm text-center font-bold">
            Sorry, we don't have ABI matched,
            <br />
            Click here to input ABI manually
          </div>
        </div>
      )}
      {!inputHidden && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-2">
          <Button
            size="icon"
            onClick={() => setInputHidden(true)}
            variant="neutral"
          >
            <X className="w-4 h-4" color="red" />
          </Button>
          <Button size="icon" onClick={onSubmit}>
            <Check className="w-4 h-4" color="green" />
          </Button>
        </div>
      )}
    </div>
  )
}
