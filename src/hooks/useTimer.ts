import { useMutation, useQuery } from 'react-query'
import { useAPI } from '../api'
import useTimerState from '../store/timer'
import usePeopleData from './usePeopleData'
import { BillingStatus } from '../api/models'
import { useState } from 'react'

function useTimer() {
  const { setCurrentTimelog, setIsRunning, currentTimelog, isRunning } =
    useTimerState()
  const { startTimer, pauseResumeTimer, getCurrentlyRunningTimelog } = useAPI()
  const { jobs, isFetching } = usePeopleData()
  const [isLoading, setIsLoading] = useState(false)

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
    ({
      timelogId,
      timer,
    }: {
      timelogId: string
      timer: 'start' | 'stop' | 'pause'
    }) => pauseResumeTimer(timelogId, timer)
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

    setIsLoading(true)

    try {
      if (isRunning) {
        await pause()
      }

      // wait for 1s to make sure that the new timelog has a different start time
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
    } finally {
      setIsLoading(false)
    }
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

  const resumePast = async (jobId: string, task: string, timeLogId: string) => {
    if (isRunning) {
      if (currentTimelog?.timelogId === timeLogId) {
        await pauseResumeTimerMutation.mutateAsync({
          timelogId: timeLogId,
          timer: 'pause',
        })

        setIsRunning(false)
      }

      return
    }

    const job = jobs.find((j) => j.jobId === jobId)

    setCurrentTimelog({
      jobId,
      jobName: job!.jobName,
      timelogId: timeLogId,
      taskName: task,
    })

    await pauseResumeTimerMutation.mutateAsync({
      timelogId: timeLogId,
      timer: 'start',
    })

    setIsRunning(true)
  }

  return {
    startNew,
    pause,
    resume,
    resumePast,
    isLoading:
      startTimerMutation.isLoading ||
      pauseResumeTimerMutation.isLoading ||
      currentlyRunningTimelog.isLoading ||
      isFetching ||
      isLoading,
  }
}

export default useTimer
