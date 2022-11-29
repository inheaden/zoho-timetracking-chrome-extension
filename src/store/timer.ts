import create from 'zustand'
import { persist } from 'zustand/middleware'
import { CurrentTimer } from '../api/models'

interface TimerState {
  isRunning: boolean
  setIsRunning: (isRunning: boolean) => void

  currentTimelog?: CurrentTimer
  setCurrentTimelog: (currentTimelog?: CurrentTimer) => void
}

const useTimerState = create<TimerState>()(
  persist(
    (set) => ({
      isRunning: false,
      setIsRunning: (isRunning: boolean) =>
        set((state) => ({ ...state, isRunning })),

      currentTimelog: undefined,
      setCurrentTimelog: (currentTimelog?: CurrentTimer) =>
        set((state) => ({ ...state, currentTimelog })),
    }),
    {
      name: 'timer',
    }
  )
)

export default useTimerState
