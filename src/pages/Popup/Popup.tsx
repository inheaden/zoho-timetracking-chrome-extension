import React from 'react'
import useAuthState from '../../store/auth'
import { Text, Flex } from '@chakra-ui/react'
import './Popup.css'
import JobSearch from '../../components/JobSearch'
import Timelogs from '../../components/Timelogs'
import TimerButton from '../../components/TimerButton'
import { useAPI } from '../../api/index'
import { useMutation } from 'react-query'
import useTimerState from '../../store/timer'

const Popup = () => {
  const { token, email } = useAuthState()
  const { setCurrentTimelog, setIsRunning } = useTimerState()

  if (!token || !email) {
    return (
      <Flex height="300px" justifyContent="center" alignItems="center" p="2">
        <Text fontSize="2xl" textAlign="center">
          Please go to options and set the Access token and email
        </Text>
      </Flex>
    )
  }

  const { startTimer } = useAPI()

  const startTimerMutation = useMutation('startTimer', startTimer)

  return (
    <Flex
      height="500px"
      p={4}
      flexDirection="column"
      justifyContent="space-between"
    >
      <JobSearch
        onChange={async (job) => {
          const log = await startTimerMutation.mutateAsync(job.id)
          setCurrentTimelog({
            timelogId: log.timelogId,
            ...job,
            isCurrentlyRunning: true,
            jobId: job.id,
            jobName: job.name,
          })
          setIsRunning(true)
        }}
      />
      <TimerButton />
      <Timelogs />
    </Flex>
  )
}

export default Popup
