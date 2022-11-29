import useAuthState from '../store/auth'
import { Job, RefreshTokenResponse, Response, Timelog } from './models'
import { subWeeks, format } from 'date-fns'

const API_BASE = 'https://people.zoho.eu/people/api'
const REFRESH_TOKEN_URL =
  'https://refreshtoken.oauth.timetracking.inheaden.cloud'

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
    startTimer: (jobId: string) => startTimer(middleware)(email!, jobId),
    pauseResumeTimer: (timelogId: string, timer: 'start' | 'stop') =>
      pauseResumeTimer(middleware)(timelogId, timer),
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
        timelogs.sort((a, b) => Number(b.timelogId) - Number(a.timelogId))
      )
    })
}

function startTimer(m: Middleware<Timelog>) {
  return (user: string, jobId: string) =>
    m((headers) => {
      return zohoPost<Timelog>(
        `${API_BASE}/timetracker/timer?user=${user}&jobId=${jobId}&workDate=${makeZohoDate(
          new Date()
        )}&billingStatus=nonbillable&timer=start`,
        headers
      )
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
    .then((res) => res.response.result)
}

function makeZohoDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}