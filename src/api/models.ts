export interface Response<T> {
  response: {
    result: T
  }
}

export interface Job {
  jobId: string
  jobName: string
  projectId: string
  projectName: string
  clientId: string
  clientName: string
}

export interface Timelog {
  jobId: string
  jobName: string
  projectId: string
  projectName: string
  clientId: string
  isCurrentlyRunning: boolean
  timelogId: string
}
