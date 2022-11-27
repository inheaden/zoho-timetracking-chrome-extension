import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // make sure that we never refetch data automatically
      // this saves API calls which are limited
      staleTime: Infinity,
    },
  },
})

export interface Props {}

/**
 *
 */
const AppContainer = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  )
}

export default AppContainer
