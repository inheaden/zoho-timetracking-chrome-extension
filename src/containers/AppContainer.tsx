import React, { useEffect } from 'react'
import { ChakraProvider, useToast } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // make sure that we never refetch data automatically
      // this saves API calls which are limited
      staleTime: Infinity,
      retry: false,
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
      <InnerAppContainer>{children}</InnerAppContainer>
    </ChakraProvider>
  )
}

const InnerAppContainer = ({ children }: React.PropsWithChildren<Props>) => {
  const toast = useToast()

  const onError = (event: any) => {
    toast({
      title: 'Error',
      description: event.message,
      status: 'error',
    })
  }

  queryClient.setDefaultOptions({
    queries: {
      onError,
      ...queryClient.getDefaultOptions().queries,
    },
    mutations: {
      onError,
    },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default AppContainer
