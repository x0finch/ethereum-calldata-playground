"use client"

import { createContext, useContext } from "react"
import { HistoryItem, useHistory } from "../lib/hooks/use-history"

const Context = createContext<{
  historyId: string
  historyItem: HistoryItem | null
}>({
  historyId: "",
  historyItem: null,
})

export function useSelectedHistoryItem() {
  return useContext(Context)
}

export function SelectedHistoryItemProvider({
  historyId,
  children,
}: {
  historyId: string
  children: React.ReactNode
}) {
  const { history } = useHistory()
  const historyItem = history[historyId]

  return (
    <Context.Provider value={{ historyId, historyItem }}>
      {children}
    </Context.Provider>
  )
}
