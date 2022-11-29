import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Job } from '../../hooks/usePeopleData'
import useTimer from '../../hooks/useTimer'
import JobSearch from '../JobSearch'
import { BillingStatus } from '../../api/models'

/**
 *
 */
const NewTimerForm = () => {
  const [job, setJob] = React.useState<Job | undefined>()
  const [task, setTask] = React.useState<string>('')
  const [billingStatus, setBillingStatus] =
    React.useState<BillingStatus>('non-billable')
  const [billingStatusDisabled, setBillingStatusDisabled] =
    React.useState(false)

  const { startNew, isLoading } = useTimer()

  useEffect(() => {
    if (job?.jobBillableStatus) {
      setBillingStatus(
        job.jobBillableStatus === 'Billable' ? 'billable' : 'non-billable'
      )
      setBillingStatusDisabled(true)
    } else {
      setBillingStatus('non-billable')
      setBillingStatusDisabled(false)
    }
  }, [job])

  const handleSubmit = async () => {
    if (!job) return

    await startNew(job?.id, task, billingStatus)

    setJob(undefined)
    setTask('')
    setBillingStatus('non-billable')
  }

  return (
    <Flex flexDirection="column" gap={4}>
      <JobSearch onChange={setJob} />
      <FormControl>
        <FormLabel>Task</FormLabel>
        <Input
          onChange={(e) => setTask(e.target.value)}
          value={task}
          maxLength={500}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Billing status</FormLabel>
        <Select
          disabled={billingStatusDisabled}
          onChange={(e) => setBillingStatus(e.target.value as any)}
          value={billingStatus}
        >
          <option value="billable">Billable</option>
          <option value="non-billable">Non-billable</option>
        </Select>
      </FormControl>
      <Button disabled={!job} onClick={handleSubmit} isLoading={isLoading}>
        Start timer
      </Button>
    </Flex>
  )
}

export default NewTimerForm
