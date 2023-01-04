import { differenceInSeconds } from 'date-fns'
import { TimelogExtra } from './api/models'

/**
 * Converts date value of "20.10.2022" format to a valid date and check against a 24 hours window
 */
export const checkIfTimeForRunningATaskHasElapsed = (timelog: TimelogExtra) => {
  const workDate: Array<string> = timelog.workDate.split('.')
  const formattedWorkDate = new Date()

  formattedWorkDate.setDate(Number(workDate[0]))
  formattedWorkDate.setMonth(Number(workDate[1]) - 1)
  formattedWorkDate.setFullYear(Number(workDate[2]))

  const timeHasNotElapsed =
    differenceInSeconds(formattedWorkDate, new Date()) >= 0

  return timeHasNotElapsed
}
