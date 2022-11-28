import create from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token?: string
  setToken: (token: string) => void

  refreshToken?: string
  setRefreshToken: (refreshToken: string) => void

  expiresAt?: number
  setExpiresAt: (expiresAt: number) => void

  email?: string
  setEmail: (email: string) => void
}

const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      setToken: (token?: string) => set((state) => ({ ...state, token })),

      refreshToken: undefined,
      setRefreshToken: (refreshToken?: string) =>
        set((state) => ({ ...state, refreshToken })),

      expiresAt: undefined,
      setExpiresAt: (expiresAt?: number) =>
        set((state) => ({ ...state, expiresAt })),

      email: undefined,
      setEmail: (email?: string) => set((state) => ({ ...state, email })),
    }),
    {
      name: 'auth',
    }
  )
)

export default useAuthState
