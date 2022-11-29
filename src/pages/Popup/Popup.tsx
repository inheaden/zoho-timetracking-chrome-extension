import React from 'react'
import useAuthState from '../../store/auth'
import { Text, Flex } from '@chakra-ui/react'
import './Popup.css'
import JobSearch from '../../components/JobSearch'
import Timelogs from '../../components/Timelogs'
import TimerButton from '../../components/TimerButton'
import NewTimerForm from '../../components/NewTimerForm'

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
    </Flex>
  )
}

export default Popup
