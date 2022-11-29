import useAuthState from '../store/auth'
import {
  CurrentTimer,
  Job,
  RefreshTokenResponse,
  Response,
  Timelog,
} from './models'
import { subWeeks, format } from 'date-fns'
import { Config } from '../config'
import { BillingStatus } from './models'

const API_BASE = Config.zohoPeopleApiBase
const REFRESH_TOKEN_URL = Config.refreshTokenUrl

type Action<T> = (header?: RequestInit['headers']) => Promise<T>

export type Middleware<T> = (action: Action<T>) => Promise<T>

export function useAPI() {
  const { token, email, refreshToken, expiresAt, setToken, setExpiresAt } =
    useAuthState()

  const middleware = (action: Action<any>) => {
    if (refreshToken && expiresAt && expiresAt < Date.now()) {
      return refreshAccessToken(refreshToken).then((result) => {
        setToken(result.access_token)
        setExpiresAt(Date.now() + result.expires_in * 1000)

        return action({
          Authorization: `Bearer ${result.access_token}`,
        })
      })
    }

    return action({
      Authorization: `Bearer ${token}`,
    })
  }

  return {
    getJobs: () => getJobs(middleware)(email!),
    getTimelogs: () => getTimelogs(middleware)(email!),
    startTimer: (
      jobId: string,
      workItem: string,
      billingStatus: BillingStatus
    ) => startTimer(middleware)(email!, jobId, workItem, billingStatus),
    pauseResumeTimer: (timelogId: string, timer: 'start' | 'stop') =>
      pauseResumeTimer(middleware)(timelogId, timer),
    getCurrentlyRunningTimelog: () => getCurrentlyRunningTimelog(middleware)(),
  }
}

function getJobs(m: Middleware<Job[]>) {
  return (assignedTo: string) =>
    m((headers) => {
      return zohoGet<Job[]>(
        `${API_BASE}/timetracker/getjobs?assignedTo=${assignedTo}&jobStatus=in-progress`,
        headers
      )
    })
}

function getTimelogs(m: Middleware<Timelog[]>) {
  return (assignedTo: string) =>
    m((headers) => {
      const lastWeek = subWeeks(new Date(), 1)
      const today = new Date()

      return zohoGet<Timelog[]>(
        `${API_BASE}/timetracker/gettimelogs?user=${assignedTo}&fromDate=${makeZohoDate(
          lastWeek
        )}&toDate=${makeZohoDate(today)}`,
        headers
      ).then((timelogs) =>
        timelogs.sort((a, b) => Number(b.timeLogId) - Number(a.timeLogId))
      )
    })
}

function getCurrentlyRunningTimelog(m: Middleware<CurrentTimer | undefined>) {
  return () =>
    m((headers) => {
      return zohoGet<CurrentTimer | undefined>(
        `${API_BASE}/timetracker/getcurrentlyrunningtimer`,
        headers
      ).then((timelogs) => timelogs)
    })
}

function startTimer(m: Middleware<Pick<Timelog, 'timeLogId'>>) {
  return (
    user: string,
    jobId: string,
    workItem: string,
    billingStatus: BillingStatus
  ) =>
    m((headers) => {
      return zohoPost<Timelog[]>(
        `${API_BASE}/timetracker/timer?user=${user}&jobId=${jobId}&workDate=${makeZohoDate(
          new Date()
        )}&billingStatus=${billingStatus}&timer=start&workItem=${workItem}`,
        headers
      ).then((timelogs) => timelogs[0])
    })
}

function pauseResumeTimer(m: Middleware<Timelog>) {
  return (timelogId: string, timer: 'start' | 'stop') =>
    m((headers) => {
      return zohoPost<Timelog>(
        `${API_BASE}/timetracker/timer?timeLogId=${timelogId}&timer=${timer}`,
        headers
      )
    })
}

function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  return fetch(`${REFRESH_TOKEN_URL}?refresh_token=${refreshToken}`).then(
    (res) => res.json()
  )
}

function zohoGet<T>(url: string, headers?: RequestInit['headers']) {
  return fetch(url, {
    headers: {
      ...headers,
    },
  })
    .then((res) => res.json() as Promise<Response<T>>)
    .then(checkForErrors)
    .then((res) => res.response.result)
}

function zohoPost<T>(url: string, headers?: RequestInit['headers']) {
  return fetch(url, {
    method: 'POST',
    headers: {
      ...headers,
    },
  })
    .then((res) => res.json() as Promise<Response<T>>)
    .then(checkForErrors)
    .then((res) => res.response.result)
}

function makeZohoDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function checkForErrors<T>(res: Response<T>) {
  if (res.response.errors) {
    const errorArray = Array.isArray(res.response.errors)
      ? res.response.errors
      : [res.response.errors]
    throw new Error(errorArray[0].message)
  }

  return res
}
