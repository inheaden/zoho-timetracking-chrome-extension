import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { useAPI } from '../api'
import { BillingStatus, TimelogExtra } from '../api/models'
import { checkIfTimeForRunningATaskHasElapsed } from '../helpers'
import useTimerState from '../store/timer'
import usePeopleData from './usePeopleData'

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

  const resumePast = async (timelog: TimelogExtra, callback?: Function) => {
    if (isRunning) {
      // Pause any running timer
      await pauseResumeTimerMutation.mutateAsync({
        timelogId: currentTimelog?.timelogId ?? timelog?.timelogId,
        timer: 'pause',
      })
      setIsRunning(false)
      if (currentTimelog?.timelogId === timelog?.timelogId) {
        callback?.()
        return
      }
    }

    // setTimeout prevents time overlap error
    setTimeout(async () => {
      const timeHasNotElapsed = checkIfTimeForRunningATaskHasElapsed(timelog)

      if (!timeHasNotElapsed) return

      const job = jobs.find((j) => j.jobId === timelog.jobId)

      setCurrentTimelog({
        jobId: timelog.jobId,
        jobName: job!.jobName,
        timelogId: timelog.timelogId,
        taskName: timelog.taskName,
      })

      await pauseResumeTimerMutation.mutateAsync({
        timelogId: timelog.timelogId,
        timer: 'start',
      })

      setIsRunning(true)

      callback?.()
    }, 1000)
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
