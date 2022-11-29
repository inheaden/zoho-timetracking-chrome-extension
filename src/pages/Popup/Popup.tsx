import React from 'react'
import useAuthState from '../../store/auth'
import { Text, Flex, Link } from '@chakra-ui/react'
import './Popup.css'
import TimerButton from '../../components/TimerButton'
import NewTimerForm from '../../components/NewTimerForm'
import { Config } from '../../config'

const Popup = () => {
  const { token, email } = useAuthState()

  if (!token || !email) {
    return (
      <Flex height="300px" justifyContent="center" alignItems="center" p="2">
        <Text fontSize="2xl" textAlign="center">
          Please go to options and authenticate
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      height="500px"
      p={4}
      flexDirection="column"
      justifyContent="space-between"
    >
      <NewTimerForm />
      <TimerButton />
      {/* <Timelogs /> */}

      <Flex gap={4}>
        <Link fontSize={10} href={`${Config.github}/issues`} target="_blank">
          File an issue
        </Link>
        <Link fontSize={10} href="https://inheaden.io" target="_blank">
          Powered by Inheaden
        </Link>
      </Flex>
    </Flex>
  )
}

export default Popup
