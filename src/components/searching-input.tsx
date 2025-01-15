"use client"

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
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const CALLDATA_PATTERN = /^0x[0-9a-fA-F]{8,}$/
const formSchema = z.object({
  search: z.string().refine((value) => CALLDATA_PATTERN.test(value), {
    message: "Invalid calldata",
  }),
})

export function SearchingInput({}: { handleSubmit?: (text: string) => void }) {
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { search } = values
    router.push(`${pathname}?q=${search}`)
    form.reset()
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
