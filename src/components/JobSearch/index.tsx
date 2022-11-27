import React from 'react'
import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Text,
} from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
  Item,
} from '@choc-ui/chakra-autocomplete'
import usePeopleData, { Job } from '../../hooks/usePeopleData'

export interface Props {
  onChange?: (value: Job) => void
}

/**
 * Displays an autocomplete for all jobs in Zoho People.
 */
const JobSearch = ({ onChange }: Props) => {
  const { jobs } = usePeopleData()

  return (
    <Flex w="full">
      <FormControl>
        <FormLabel>Search for a Job</FormLabel>
        <AutoComplete
          openOnFocus
          onChange={(_, item) => {
            if (item) {
              onChange?.((item as Item).originalValue as Job)
            }
          }}
        >
          <AutoCompleteInput variant="filled" />
          <AutoCompleteList>
            {jobs.map((job) => (
              <AutoCompleteItem
                key={`option-${job.id}`}
                value={job}
                label={job.name + ' - ' + job.projectName}
                getValue={(job) => job.name + ' - ' + job.projectName}
                textTransform="capitalize"
                flexDirection="column"
              >
                <Text>{job.name}</Text>
                <Text fontSize={10}>
                  {job.projectName} - {job.clientName}
                </Text>
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </FormControl>
    </Flex>
  )
}

export default JobSearch
