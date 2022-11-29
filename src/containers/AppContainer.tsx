import React, { useEffect } from 'react'
import { ChakraProvider, useToast } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'

// 10 minutes in ms
const cacheTime = 1000 * 60 * 10

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // make sure that we don't refetch data often
      // this saves API calls which are limited
      // set to 24h
      staleTime: cacheTime,
      cacheTime: cacheTime,
      retry: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
    },
  },
})

const doNotPersist = ['currentTimelog']

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage,
})

const doPersistQueryClient = async () => {
  await persistQueryClient({
    queryClient,
    persistor: localStoragePersistor,
    maxAge: cacheTime,
    hydrateOptions: {},
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        return !doNotPersist.includes(query.queryKey as any)
      },
    },
  })
}

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
  const [isReady, setIsReady] = React.useState(false)

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

  useEffect(() => {
    doPersistQueryClient().then(() => {
      setIsReady(true)
    })
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default AppContainer
