import React, { useEffect } from 'react'
import './Options.css'
import useAuthState from '../../store/auth'
import { Input, Flex, Text, Button } from '@chakra-ui/react'

interface Props {
  title: string
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const { token, setToken, email, setEmail, setRefreshToken, setExpiresAt } =
    useAuthState()

  const [authSuccess, setAuthSuccess] = React.useState(false)

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
    <Flex direction="column" maxWidth="500px" width="100%" padding="4">
      <Text fontSize={20} textAlign="center">
        You have successfully authenticated. You can now close this window and
        start using the extension.
      </Text>
    </Flex>
  )

  const authDisplay = (
    <Flex direction="column" maxWidth="500px" width="100%" padding="4">
      <Button
        onClick={() => {
          window.location.href =
            'https://start.oauth.timetracking.inheaden.cloud'
        }}
      >
        Authenticate
      </Button>
    </Flex>
  )

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      {authSuccess ? authSuccessDisplay : authDisplay}
    </Flex>
  )
}

export default Options
