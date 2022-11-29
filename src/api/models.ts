export interface Response<T> {
  response: {
    result: T
    message: string
    errors?: { message: string } | { message: string }[]
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
  timeLogId: string
  billingStatus: BillingStatus
  hours: string
  taskName: string
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
