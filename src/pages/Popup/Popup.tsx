import { Button, Flex, Link, Text } from '@chakra-ui/react'
import React from 'react'
import NewTimerForm from '../../components/NewTimerForm'
import Timelogs from '../../components/Timelogs'
import TimerButton from '../../components/TimerButton'
import { Config } from '../../config'
import useAuthState from '../../store/auth'
import './Popup.css'
import useTimerState from '../../store/timer'

const Popup = () => {
  const { token, email } = useAuthState()

  // update extension icon on timer state change
  useTimerState.subscribe((state) => {
    if (state.isRunning) {
      chrome.action.setIcon({
        path: {
          '16': 'icon-active-16.png',
          '48': 'icon-active-48.png',
          '128': 'icon-active-128.png',
        },
      })
    } else {
      chrome.action.setIcon({
        path: {
          '16': 'icon-16.png',
          '48': 'icon-48.png',
          '128': 'icon-128.png',
        },
      })
    }
  })

  if (!token || !email) {
    return (
      <Flex
        height="300px"
        justifyContent="center"
        alignItems="center"
        p="2"
        flexDirection="column"
        gap={4}
      >
        <Text fontSize="2xl" textAlign="center">
          Please go to options and authenticate.
        </Text>
        <Link href={chrome.runtime.getURL('options.html')} target="_blank">
          <Button>Open Options</Button>
        </Link>
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
      <Timelogs />

      <Flex gap={4}>
        <Link fontSize={10} href={`${Config.github}/issues`} target="_blank">
          File an issue
        </Link>
        <Link
          fontSize={10}
          href="https://inheaden.io"
          target="_blank"
          mr="auto"
        >
          Powered by Inheaden
        </Link>
        <Link fontSize={10} href="https://people.zoho.eu" target="_blank">
          Open Zoho People
        </Link>
      </Flex>
    </Flex>
  )
}

export default Popup
