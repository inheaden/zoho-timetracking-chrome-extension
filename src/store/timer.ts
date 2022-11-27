import create from 'zustand'
import { persist } from 'zustand/middleware'
import { Timelog } from '../api/models'

interface TimerState {
  isRunning: boolean
  setIsRunning: (isRunning: boolean) => void

  currentTimelog?: Timelog
  setCurrentTimelog: (currentTimelog?: Timelog) => void
}

const useTimerState = create<TimerState>()(
  persist(
    (set) => ({
      isRunning: false,
      setIsRunning: (isRunning: boolean) =>
        set((state) => ({ ...state, isRunning })),

      currentTimelog: undefined,
      setCurrentTimelog: (currentTimelog?: Timelog) =>
        set((state) => ({ ...state, currentTimelog })),
    }),
    {
      name: 'timer',
    }
  )
)

export default useTimerState
