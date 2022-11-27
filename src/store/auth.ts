import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token?: string
  setToken: (token: string) => void

  email?: string
  setEmail: (email: string) => void
}

const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (token?: string) => set((state) => ({ ...state, token })),

      email: undefined,
      setEmail: (email?: string) => set((state) => ({ ...state, email })),
    }),
    {
      name: 'auth',
    }
  )
)

export default useAuthState
