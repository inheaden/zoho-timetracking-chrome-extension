import React from 'react'
import useTimerState from '../../store/timer'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons'
import useTimer from '../../hooks/useTimer'

/**
 *
 */
const TimerButton = () => {
  const { isRunning, currentTimelog } = useTimerState()

  const { pause, resume, isLoading } = useTimer()

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <IconButton
        isLoading={isLoading}
        aria-label="Start timer"
        icon={isRunning ? <CloseIcon /> : <PlusSquareIcon />}
        onClick={isRunning ? pause : resume}
        bg={isRunning ? 'red.400' : 'green.400'}
        mb={4}
      />
      <Flex flexDirection="column" textAlign="center">
        <Text>{currentTimelog?.jobName ?? 'No timer available right now'}</Text>
        <Text fontSize={10}>{currentTimelog?.taskName}</Text>
      </Flex>
    </Flex>
  )
}

export default TimerButton
