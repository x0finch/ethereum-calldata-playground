import { Calldata } from "./calldata"
import { SearchingInput } from "./searching-input"
import { Title } from "./title"

type Props = {
  id: string
}

export function Panel({ id }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <Title />
      <SearchingInput />
      <Calldata id={id} />
    </div>
  )
}
