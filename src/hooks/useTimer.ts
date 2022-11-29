import { useMutation, useQuery } from 'react-query'
import { useAPI } from '../api'
import useTimerState from '../store/timer'
import usePeopleData from './usePeopleData'
import { BillingStatus } from '../api/models'

function useTimer() {
  const { setCurrentTimelog, setIsRunning, currentTimelog, isRunning } =
    useTimerState()
  const { startTimer, pauseResumeTimer, getCurrentlyRunningTimelog } = useAPI()
  const { jobs, isFetching } = usePeopleData()
  const startTimerMutation = useMutation(
    'startTimer',
    ({
      jobId,
      task,
      billingStatus,
    }: {
      jobId: string
      task: string
      billingStatus: BillingStatus
    }) => startTimer(jobId, task, billingStatus)
  )
  const pauseResumeTimerMutation = useMutation(
    'pauseResumeTimer',
    ({ timelogId, timer }: { timelogId: string; timer: 'start' | 'stop' }) =>
      pauseResumeTimer(timelogId, timer)
  )

  const currentlyRunningTimelog = useQuery(
    'currentTimelog',
    getCurrentlyRunningTimelog,
    {
      onSuccess: (data) => {
        setCurrentTimelog(data)
        setIsRunning(!!data)
      },
    }
  )

  const startNew = async (
    jobId: string,
    task: string,
    billingStatus: BillingStatus
  ) => {
    const job = jobs.find((j) => j.jobId === jobId)

    if (!job) return

    if (isRunning) {
      await pause()
    }

    const timelog = await startTimerMutation.mutateAsync({
      jobId,
      task,
      billingStatus,
    })

    setCurrentTimelog({
      jobId,
      jobName: job.jobName,
      timelogId: timelog.timeLogId,
      taskName: task,
    })
    setIsRunning(true)
  }

  const pause = async () => {
    if (!currentTimelog) return

    await pauseResumeTimerMutation.mutateAsync({
      timelogId: currentTimelog.timelogId,
      timer: 'stop',
    })

    setIsRunning(false)
  }

  const resume = async () => {
    if (!currentTimelog) return

    await pauseResumeTimerMutation.mutateAsync({
      timelogId: currentTimelog.timelogId,
      timer: 'start',
    })

    setIsRunning(true)
  }

  return {
    startNew,
    pause,
    resume,
    isLoading:
      startTimerMutation.isLoading ||
      pauseResumeTimerMutation.isLoading ||
      currentlyRunningTimelog.isLoading ||
      isFetching,
  }
}

export default useTimer
