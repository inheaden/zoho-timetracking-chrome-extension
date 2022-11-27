import React, { useEffect } from 'react'
import useTimelogs from '../../hooks/useTimelogs'
import useTimerState from '../../store/timer'
import { Flex, IconButton, Text } from '@chakra-ui/react'
import { PlusSquareIcon, CloseIcon } from '@chakra-ui/icons'
import { useAPI } from '../../api/index'
import { useMutation } from 'react-query'

export interface Props {}

/**
 *
 */
const TimerButton = ({}: Props) => {
  const { data } = useTimelogs()
  const { isRunning, setIsRunning, currentTimelog, setCurrentTimelog } =
    useTimerState()

  const { pauseResumeTimer } = useAPI()

  const pauseResumeTimerMutation = useMutation(
    'pauseResumeTimer',
    ({ timelogId, timer }: { timelogId: string; timer: 'start' | 'stop' }) =>
      pauseResumeTimer(timelogId, timer)
  )

  useEffect(() => {
    if (data?.length) {
      setIsRunning(data[0].isCurrentlyRunning)
      setCurrentTimelog(data[0])
    }
  }, [data, setCurrentTimelog, setIsRunning])

  const handleStartTimer = async () => {
    if (!currentTimelog) {
      return
    }

    await pauseResumeTimerMutation.mutateAsync({
      timelogId: currentTimelog.timelogId,
      timer: 'start',
    })
    setIsRunning(true)
  }

  const handleStopTimer = async () => {
    if (!currentTimelog) {
      return
    }

    setIsRunning(false)

    await pauseResumeTimerMutation.mutateAsync({
      timelogId: currentTimelog.timelogId,
      timer: 'stop',
    })
  }

  return (
    <Flex alignItems="center">
      <IconButton
        aria-label="Start timer"
        icon={isRunning ? <CloseIcon /> : <PlusSquareIcon />}
        onClick={isRunning ? handleStopTimer : handleStartTimer}
      />
      <Flex flexDirection="column" ml="4">
        <Text>{currentTimelog?.jobName}</Text>
        <Text fontSize={10}>{currentTimelog?.projectName}</Text>
      </Flex>
    </Flex>
  )
}

export default TimerButton
