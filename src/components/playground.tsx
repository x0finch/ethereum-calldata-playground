import { CalldataCard } from "./calldata-card"
import { HistoryIndicator } from "./history-indicator"
import { SearchingInput } from "./searching-input"
import { Title } from "./title"

type Props = {
  id: string
}

export function Playground({ id }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 relative">
      <Title />
      <SearchingInput />
      <CalldataCard id={id} />
      <HistoryIndicator />
    </div>
  )
}
