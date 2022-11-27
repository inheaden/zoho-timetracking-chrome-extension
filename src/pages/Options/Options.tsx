import React from 'react'
import './Options.css'
import useAuthState from '../../store/auth'
import { Input, Flex, Text } from '@chakra-ui/react'

interface Props {
  title: string
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const { token, setToken, email, setEmail } = useAuthState()

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Flex direction="column" maxWidth="500px" width="100%" padding="4">
        <Text fontSize="2xl" textAlign="center" marginBottom="4">
          Options
        </Text>
        <Input
          placeholder="Your E-Mail"
          value={email ?? ''}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Zoho People OAuth token"
          value={token ?? ''}
          onChange={(e) => setToken(e.target.value)}
        />
      </Flex>
    </Flex>
  )
}

export default Options
