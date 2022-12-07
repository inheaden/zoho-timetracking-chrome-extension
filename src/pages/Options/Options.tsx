import React, { useEffect } from 'react'
import './Options.css'
import useAuthState from '../../store/auth'
import {
  Input,
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  Link,
} from '@chakra-ui/react'
import { Config } from '../../config'

interface Props {
  title: string
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const { setToken, email, setEmail, setRefreshToken, setExpiresAt } =
    useAuthState()

  const [authSuccess, setAuthSuccess] = React.useState(false)
  const [authClicked, setAuthClicked] = React.useState(false)

  const authSuccessDisplay = (
    <Flex direction="column">
      <Text fontSize={20} textAlign="center">
        You have successfully authenticated. You can now close this window and
        start using the extension.
      </Text>
    </Flex>
  )

  const authDisplay = (
    <Flex direction="column">
      <Text fontSize="2xl" as="h1" textAlign="center" mb={4}>
        Options
      </Text>
      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email ?? ''}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of your Zoho people account"
        />
      </FormControl>
      <Button
        isLoading={authClicked}
        loadingText="Opening..."
        onClick={async () => {
          setAuthClicked(true)

          const redirectUri = chrome.identity.getRedirectURL()

          const url = await chrome.identity.launchWebAuthFlow({
            url: `${Config.authenticateUrl}?redirect_uri=${redirectUri}`,
            interactive: true,
          })

          if (!url) {
            setAuthClicked(false)
            console.error('No url returned')
            return
          }

          const parsedUrl = new URL(url)
          const token = parsedUrl.searchParams.get('access_token')
          const refreshToken = parsedUrl.searchParams.get('refresh_token')
          const expiresIn = parsedUrl.searchParams.get('expires_in')

          if (token && refreshToken && expiresIn) {
            setToken(token)
            setRefreshToken(refreshToken)
            setExpiresAt(Date.now() + Number(expiresIn) * 1000)

            setAuthSuccess(true)
          }
        }}
      >
        Authenticate with Zoho
      </Button>
      <Text fontSize="smaller" textAlign="center">
        This can take a while to open.
      </Text>
    </Flex>
  )

  return (
    <Flex flexDirection="column" height="100vh" alignItems="center">
      <Flex
        flex={1}
        justifyContent="center"
        maxWidth="500px"
        width="100%"
        padding="4"
        flexDirection="column"
      >
        {authSuccess ? authSuccessDisplay : authDisplay}
      </Flex>

      <Flex p={4} gap={4}>
        <Link href={`${Config.github}/issues`} target="_blank">
          File an issue
        </Link>
        <Link href="https://inheaden.io" target="_blank">
          Powered by Inheaden
        </Link>
      </Flex>
    </Flex>
  )
}

export default Options
