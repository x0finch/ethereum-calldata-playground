import type { TxResponse } from "@/app/api/hashes/[hash]/route"
import { useHistory } from "@/lib/hooks/use-history"
import { SELECTOR_LENGTH } from "@/lib/parse-calldata"
import { fetcher, generateUUID, shortAddress } from "@/lib/utils"
import { PopoverContent } from "@shadcn/components/ui/popover"
import { Skeleton } from "@shadcn/components/ui/skeleton"
import { cn } from "@shadcn/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

export const TXHASH_PATTERN = /^0x[0-9a-fA-F]{64}$/
export const CALLLDATA_PATTERN = /^0x[0-9a-fA-F]{8,}$/

export function Suggestions({ searchTerm }: { searchTerm: string }) {
  const [mayBeTxHash, mayBeCalldata] = useMemo(
    () => [TXHASH_PATTERN.test(searchTerm), CALLLDATA_PATTERN.test(searchTerm)],
    [searchTerm]
  )
  const isSearchInvalid = !mayBeTxHash && !mayBeCalldata

  return (
    <PopoverContent
      className="w-[calc(100vw-6rem)] lg:w-screen lg:max-w-[50rem] lg:ml-1 mt-2"
      side="bottom"
      align="start"
    >
      <div className=" flex flex-col">
        {isSearchInvalid && (
          <div className="text-sm text-muted-foreground">
            Please input a valid transaction hash or calldata
          </div>
        )}
        {mayBeTxHash && <IsItAContractCall searchTerm={searchTerm} />}
        {mayBeCalldata && <IsItACalldata searchTerm={searchTerm} />}
      </div>
    </PopoverContent>
  )
}

function IsItAContractCall({ searchTerm }: { searchTerm: string }) {
  const { createHistoryItem } = useHistory()
  const router = useRouter()

  const { data: tx, isLoading: isTxLoading } = useQuery<TxResponse>({
    queryKey: ["hashes", searchTerm],
    queryFn: ({ signal }) => fetcher(`/api/hashes/${searchTerm}`, { signal }),
  })

  const hasValidCalldata = CALLLDATA_PATTERN.test(tx?.calldata ?? "")
  const selector = tx?.calldata?.slice(0, SELECTOR_LENGTH)
  const { data: signatures = [], isLoading: isSelectorsLoading } = useQuery({
    queryKey: ["selectors", selector],
    queryFn: ({ signal }) => fetcher(`/api/selectors/${selector}`, { signal }),
    enabled: !!selector,
  })
  const functionName = useMemo(() => {
    if (signatures.length === 0) {
      return null
    }

    const firstSignature = signatures[0]
    return firstSignature.slice(0, firstSignature.indexOf("("))
  }, [signatures])

  const shortFrom = shortAddress(tx?.from ?? "")
  const shortTo = shortAddress(tx?.to ?? "")

  const handleClick = () => {
    if (isTxLoading || !hasValidCalldata || !tx) {
      return
    }

    const id = generateUUID()
    createHistoryItem(id, tx.calldata, tx)
    router.push(`/i/${id}`)
  }
  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-2 rounded p-2",
          isTxLoading && "cursor-wait",
          hasValidCalldata && "cursor-pointer hover:bg-accent"
        )}
        onClick={handleClick}
      >
        <div className="text-sm text-muted-foreground italic">
          Is it a contract call?
        </div>
        {isTxLoading && <Skeleton className="h-4 w-24" />}
        {!isTxLoading && !hasValidCalldata && (
          <div>No, it is not a contract call</div>
        )}
        {!isTxLoading && hasValidCalldata && (
          <div className="flex flex-row items-center flex-wrap">
            Yes, {shortFrom} call
            {isSelectorsLoading ? (
              <Skeleton className="h-4 w-24 mx-1" />
            ) : (
              <span className="font-bold mx-1">{functionName}</span>
            )}
            on {shortTo}
          </div>
        )}
      </div>
      <div className="border-b my-2" />
    </>
  )
}

function IsItACalldata({ searchTerm }: { searchTerm: string }) {
  const { createHistoryItem } = useHistory()
  const router = useRouter()

  const selector = searchTerm.slice(0, SELECTOR_LENGTH)
  const { data: signatures = [], isLoading: isSelectorsLoading } = useQuery({
    queryKey: ["selectors", selector],
    queryFn: ({ signal }) => fetcher(`/api/selectors/${selector}`, { signal }),
    retry: false,
  })

  const functionName = useMemo(() => {
    if (signatures.length === 0) {
      return null
    }

    const firstSignature = signatures[0]
    return firstSignature.slice(0, firstSignature.indexOf("("))
  }, [signatures])

  const handleClick = () => {
    if (isSelectorsLoading) {
      return
    }

    const id = generateUUID()
    createHistoryItem(id, searchTerm)
    router.push(`/i/${id}`)
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded p-2 hover:bg-accent",
        isSelectorsLoading && "cursor-wait",
        !isSelectorsLoading && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      <div className="text-sm text-muted-foreground italic">
        Is it a calldata?
      </div>
      {isSelectorsLoading && <Skeleton className="h-4 w-24" />}
      {!isSelectorsLoading && signatures.length === 0 && (
        <div>Not sure, maybe you can supply a correct abi?</div>
      )}
      {!isSelectorsLoading && signatures.length > 0 && (
        <div className="flex flex-row items-center flex-wrap">
          Yes, it is a calldata for
          <span className="font-bold mx-1">{functionName}</span>
        </div>
      )}
    </div>
  )
}
