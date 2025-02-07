"use client"

import { useHistory } from "@/lib/hooks/use-history"
import { generateUUID } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@shadcn/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@shadcn/components/ui/form"
import { Input } from "@shadcn/components/ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const CALLDATA_PATTERN = /^0x[0-9a-fA-F]{8,}$/
const formSchema = z.object({
  search: z.string().refine((value) => CALLDATA_PATTERN.test(value), {
    message: "Invalid calldata",
  }),
})

export function SearchingInput() {
  const { createHistoryItem } = useHistory()

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { search } = values

    const id = generateUUID()
    createHistoryItem(id, search)

    router.push(`/i/${id}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        name={"search"}
        className="w-full max-w-3xl flex flex-col mb-8"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="input any calldata here"
                    {...field}
                    className="flex-grow"
                  />
                  <Button type="submit">Parse</Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
