export interface Response<T> {
  response: {
    result: T
    message: string
    errors?: { message: string } | { message: string }[]
    isNextAvailable: boolean
  }
}

export type BillingStatus = 'billable' | 'non-billable'

export interface Job {
  jobId: string
  jobName: string
  projectId: string
  projectName: string
  clientId: string
  clientName: string
  jobBillableStatus: 'Billable' | 'Non-Billable'
}

export interface Timelog {
  jobId: string
  jobName: string
  projectId: string
  projectName: string
  clientId: string
  isCurrentlyRunning: boolean
  timelogId: string
  billingStatus: BillingStatus
  hours: string
  taskName: string
  workDate: string
}

export interface CurrentTimer {
  jobId: string
  jobName: string
  timelogId: string
  taskName: string
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}
