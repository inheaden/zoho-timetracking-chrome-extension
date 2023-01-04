import { Flex, Text, useToast } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { TimelogExtra } from '../../api/models'
import { checkIfTimeForRunningATaskHasElapsed } from '../../helpers'
import useTimelogs from '../../hooks/useTimelogs'
import useTimer from '../../hooks/useTimer'
import useTimerState from '../../store/timer'
import PauseButtonIcon from '../svgs/PauseButtonIcon'
import PlayButtonIcon from '../svgs/PlayButtonIcon'

export interface Props {}

/**
 *
 */
const Timelogs = ({}: Props) => {
  const { data, refetch } = useTimelogs()

  const timelogs = useMemo(() => {
    return (data ?? [])?.reverse()
  }, [data])

  return (
    <Flex flexDirection="column">
      <Text fontSize="2xl">Past timelogs</Text>
      <Flex
        flexDirection="column"
        maxHeight="200px"
        overflow="auto"
        style={{ paddingRight: 20, paddingLeft: 20 }}
      >
        {timelogs?.map((timelog) => (
          <TimelogItem timelog={timelog} onAction={() => refetch()} />
        ))}
      </Flex>
    </Flex>
  )
}

export default Timelogs

export interface TimelogItemProps {
  timelog: TimelogExtra
  onAction?(): void
}

const TimelogItem = ({ timelog, onAction }: TimelogItemProps) => {
  const { resumePast } = useTimer()
  const toast = useToast()
  const { isRunning, currentTimelog } = useTimerState()

  const actionButton = useMemo(() => {
    if (isRunning && currentTimelog?.timelogId === timelog?.timelogId) {
      return <PauseButtonIcon />
    }

    return <PlayButtonIcon />
  }, [isRunning, currentTimelog, timelog?.timelogId])

  const timeHasNotElapsed = useMemo(() => {
    return checkIfTimeForRunningATaskHasElapsed(timelog)
  }, [timelog])

  const handleStart = async (e: TimelogExtra) => {
    if (!timeHasNotElapsed) {
      toast({
        title: 'Warning',
        description: 'You cannot resume this task',
        status: 'error',
      })
      return
    }
    await resumePast(e, onAction)
  }

  return (
    <Flex key={timelog.timelogId} flexDirection="column" mb="4">
      <Flex>
        <Text flex={1}>{timelog.jobName}</Text>

        <Flex style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div onClick={() => handleStart(timelog)} style={{ marginLeft: 5 }}>
            {timeHasNotElapsed && actionButton}
          </div>

          <Text>
            {isRunning && currentTimelog?.timelogId === timelog.timelogId ? (
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            ) : (
              timelog.hours
            )}
          </Text>
        </Flex>
      </Flex>
      <Text fontSize={10}>{timelog.projectName}</Text>
      <Text fontSize={10}>{timelog.taskName}</Text>
    </Flex>
  )
}
