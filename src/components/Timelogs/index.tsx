import React from 'react'
import useTimelogs from '../../hooks/useTimelogs'
import { Flex, Text } from '@chakra-ui/react'

export interface Props {}

/**
 *
 */
const Timelogs = ({}: Props) => {
  const { data } = useTimelogs()

  return (
    <Flex flexDirection="column">
      <Text fontSize="2xl">Past timelogs</Text>
      <Flex flexDirection="column" maxHeight="200px" overflow="auto">
        {data?.map((timelog) => (
          <Flex key={timelog.timelogId} flexDirection="column" mb="4">
            <Text>{timelog.jobName}</Text>
            <Text fontSize={10}>{timelog.projectName}</Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default Timelogs
