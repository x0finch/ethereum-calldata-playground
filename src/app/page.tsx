import { Panel } from "@/components/panel"
import { SearchingInput } from "@/components/searching-input"
import { Title } from "@/components/title"
import { Button } from "@shadcn/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <Title />
      <SearchingInput />
      <Panel />
    </div>
  )
}
