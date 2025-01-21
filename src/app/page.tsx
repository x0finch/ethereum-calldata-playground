import { Panel } from "@/components/panel"
import { generateUUID } from "@/lib/utils"

export default function Home() {
  const id = generateUUID()

  return <Panel id={id} />
}
