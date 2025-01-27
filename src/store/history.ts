"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Calldata {
  id: string
  data: string
  createdAt: number
  updatedAt: number
}

export const useHistory = create<{
  history: { [id: string]: Calldata }
  addHistory: (id: string, data: string) => void
  updateHistory: (id: string, data: string) => void
  removeHistory: (id: string) => void
}>()(
  persist(
    (set) => ({
      history: {},
      addHistory: (id: string, data: string) =>
        set((state) => {
          const newState = {
            history: {
              ...state.history,
              [id]: {
                id,
                data,
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            },
          }

          return newState
        }),
      updateHistory: (id: string, data: string) =>
        set((state) => {
          const newState = { history: { ...state.history } }

          newState.history[id] = {
            ...newState.history[id],
            data,
            updatedAt: Date.now(),
          }

          return newState
        }),
      removeHistory: (id: string) =>
        set((state) => {
          const newState = { history: { ...state.history } }
          delete newState.history[id]
          return newState
        }),
    }),
    {
      name: "history-store",
    }
  )
)
