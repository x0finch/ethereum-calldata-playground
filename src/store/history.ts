"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Calldata {
  id: string
  data: string
  createdAt: number
}

export const useHistory = create<{
  history: { [id: string]: Calldata }
  addHistory: (item: Calldata) => void
  removeHistory: (id: string) => void
}>()(
  persist(
    (set) => ({
      history: {},
      addHistory: (item: Calldata) =>
        set((state) => {
          const newState = { history: { ...state.history, [item.id]: item } }
          return newState
        }),
      removeHistory: (id: string) =>
        set((state) => {
          const cloned = { history: { ...state.history } }
          delete cloned.history[id]
          return cloned
        }),
    }),
    {
      name: "history-store",
    }
  )
)
