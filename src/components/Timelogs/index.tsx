import { Flex, Text } from '@chakra-ui/react'
import { differenceInSeconds } from 'date-fns'
import React, { useCallback, useMemo } from 'react'
import { Timelog } from '../../api/models'
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
  const { data } = useTimelogs()

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
          <TimelogItem timelog={timelog} />
        ))}
      </Flex>
    </Flex>
  )
}

export default Timelogs

const TimelogItem = ({ timelog }: { timelog: Timelog }) => {
  const { resumePast } = useTimer()
  const { isRunning, currentTimelog } = useTimerState()

  const handleStart = async (e: Timelog) => {
    await resumePast(e.jobId, e.taskName, e.timelogId)
  }

  const actionButton = useCallback(
    (timeLog: string | undefined) => {
      if (isRunning && currentTimelog?.timelogId === timeLog) {
        return <PauseButtonIcon />
      }

      return <PlayButtonIcon />
    },
    [isRunning, currentTimelog]
  )

  const doNotShowButton = useCallback((e: Timelog) => {
    const workDate: Array<string> = e.workDate.split('.')
    const formattedWorkDate = new Date()

    formattedWorkDate.setDate(Number(workDate[0]))
    formattedWorkDate.setMonth(Number(workDate[1]) - 1)
    formattedWorkDate.setFullYear(Number(workDate[2]))

    const diff = differenceInSeconds(formattedWorkDate, new Date()) >= 0
    return diff
  }, [])

  return (
    <Flex key={timelog.timelogId} flexDirection="column" mb="4">
      <Flex>
        <Text flex={1}>{timelog.jobName}</Text>

        <Flex style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div onClick={() => handleStart(timelog)} style={{ marginLeft: 5 }}>
            {doNotShowButton(timelog) && actionButton(timelog?.timelogId)}
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
