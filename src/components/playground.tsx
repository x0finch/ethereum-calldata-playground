import { CalldataCard } from "./calldata-card"
import { HistoryIndicator } from "./history-indicator"
import { Searching } from "./searching"
import { Title } from "./title"
import { TransactionCard } from "./transaction-card"

type Props = {
  id: string
}

export function Playground({ id }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 relative">
      <Title />
      <Searching />
      <TransactionCard id={id} />
      <CalldataCard id={id} />
      <HistoryIndicator />
    </div>
  )
}
