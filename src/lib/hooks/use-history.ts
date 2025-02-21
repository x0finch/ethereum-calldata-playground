"use client"

import { Address, Hex } from "viem"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface TxContext {
  hash: Hex
  from: Address
  to: Address
  calldata: string
}

export interface HistoryItem {
  context?: TxContext

  id: string
  calldata: string
  signatures: { [selector: string]: string }
  createdAt: number
  updatedAt: number
}

export const useHistory = create<{
  history: { [id: string]: HistoryItem }

  createHistoryItem: (id: string, calldata: string, context?: TxContext) => void
  deleteHistoryItem: (id: string) => void
  updateCalldata: (id: string, calldata: string) => void
  applySignature: (id: string, selector: string, signature: string) => void
}>()(
  persist(
    (set) => ({
      history: {},
      createHistoryItem: (id: string, calldata: string, context?: TxContext) =>
        set((state) => {
          const newState = {
            history: {
              ...state.history,
              [id]: {
                context,

                id,
                calldata,
                signatures: {},
                createdAt: Date.now(),
                updatedAt: Date.now(),
              },
            },
          }

          return newState
        }),
      updateCalldata: (id: string, calldata: string) =>
        set((state) => {
          const newState = { history: { ...state.history } }

          newState.history[id] = {
            ...newState.history[id],
            calldata: calldata,
            updatedAt: Date.now(),
          }

          return newState
        }),
      deleteHistoryItem: (id: string) =>
        set((state) => {
          const newState = { history: { ...state.history } }
          delete newState.history[id]
          return newState
        }),
      applySignature: (id: string, selector: string, signature: string) =>
        set((state) => {
          const historyItem = state.history[id]
          if (historyItem?.signatures[selector] === signature) {
            return state
          }

          const newState = { history: { ...state.history } }

          newState.history[id] = {
            ...newState.history[id],
            updatedAt: Date.now(),
            signatures: {
              ...newState.history[id].signatures,
              [selector]: signature,
            },
          }

          return newState
        }),
    }),
    {
      name: "calldata-history",
    }
  )
)
