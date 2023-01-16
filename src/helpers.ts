import { differenceInSeconds } from 'date-fns'
import { sortBy } from 'lodash'
import { TimelogExtra } from './api/models'

/**
 * Converts zoho date value to Javascript Date
 */
export const convertZohoTimeToJavascriptTime = (timelog: TimelogExtra) => {
  const workDate: Array<string> = timelog.workDate.split('.')
  const formattedWorkDate = new Date()

  formattedWorkDate.setDate(Number(workDate[0]))
  formattedWorkDate.setMonth(Number(workDate[1]) - 1)
  formattedWorkDate.setFullYear(Number(workDate[2]))
  return formattedWorkDate
}

export const sortTimelogs = (timelogs: Array<TimelogExtra>) => {
  const newData = (timelogs ?? []).map((i) => ({
    ...i,
    convertedDate: convertZohoTimeToJavascriptTime(i),
  }))
  const sortedArrayWithoutCheckingIfAJobIsRunning = sortBy(
    newData,
    'convertedDate'
  ).reverse()

  const findRunningJob = sortedArrayWithoutCheckingIfAJobIsRunning.findIndex(
    (i) => {
      const foundRunningJob = (i.timearr ?? [])
        .map((i) => i.isRunning)
        .includes(true)
      return foundRunningJob
    }
  )

  if (findRunningJob !== -1) {
    const temp = sortedArrayWithoutCheckingIfAJobIsRunning[0]
    sortedArrayWithoutCheckingIfAJobIsRunning[0] =
      sortedArrayWithoutCheckingIfAJobIsRunning[findRunningJob]
    sortedArrayWithoutCheckingIfAJobIsRunning[findRunningJob] = temp
  }

  return sortedArrayWithoutCheckingIfAJobIsRunning
}

/**
 * Converts date value of "20.10.2022" format to a valid date and check against a 24 hours window
 */
export const checkIfTimeForRunningATaskHasElapsed = (timelog: TimelogExtra) => {
  const formattedWorkDate = convertZohoTimeToJavascriptTime(timelog)
  const timeHasNotElapsed =
    differenceInSeconds(formattedWorkDate, new Date()) >= 0

  return timeHasNotElapsed
}
