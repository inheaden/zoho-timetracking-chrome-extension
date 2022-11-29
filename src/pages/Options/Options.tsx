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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const token = query.get('access_token')
    const refreshToken = query.get('refresh_token')
    const expiresIn = query.get('expires_in')

    console.log(
      'token',
      token,
      'refreshToken',
      refreshToken,
      'expiresIn',
      expiresIn
    )

    if (token && refreshToken && expiresIn) {
      setToken(token)
      setRefreshToken(refreshToken)
      setExpiresAt(Date.now() + Number(expiresIn) * 1000)

      setAuthSuccess(true)
    }
  }, [setToken, setRefreshToken, setExpiresAt])

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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter the email of your Zoho people account"
        />
      </FormControl>
      <Button
        isLoading={authClicked}
        loadingText="Opening..."
        onClick={() => {
          setAuthClicked(true)
          window.location.href = Config.authenticateUrl
        }}
      >
        Authenticate with Zoho
      </Button>
      <Text fontSize="smaller" textAlign="center">
        This can take a while to open. Also reload when getting back to the
        extension.
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
