import { Card, CardContent } from "@shadcn/components/ui/card"

export function Header() {
  return (
    <Card className="max-w-7xl mx-auto border-4 -rotate-1">
      <CardContent className="p-4 md:p-6 ">
        <h1 className="text-2xl md:text-4xl font-black border-none">
          Ethereum Calldata Playground
        </h1>
      </CardContent>
    </Card>
  )
}
