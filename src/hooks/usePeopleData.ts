import { useCallback, useMemo } from 'react'
import useJobs from './useJobs'

function usePeopleData() {
  const { data, isLoading, refetch } = useJobs()

  const [jobs, projects, clients] = useMemo<
    [Job[], Project[], Client[]]
  >(() => {
    if (!data) return [[], [], []]

    const jobs = data.map(({ jobId, jobName, ...rest }) => ({
      id: jobId,
      name: jobName,
      ...rest,
    }))

    const projects = jobs.reduce<Project[]>((acc, job) => {
      const existingProject = acc.find((p) => p.id === job.projectId)
      if (!existingProject) {
        acc.push({
          id: job.projectId,
          name: job.projectName,
          jobs: [],
          clientId: job.clientId,
          clientName: job.clientName,
        })
      } else {
        existingProject.jobs.push(job)
      }

      return acc
    }, [])

    const clients = projects.reduce<Client[]>((acc, project) => {
      const existingClient = acc.find((c) => c.id === project.clientId)
      if (!existingClient) {
        acc.push({
          id: project.clientId,
          name: project.clientName,
          projects: [],
        })
      } else {
        existingClient.projects.push(project)
      }

      return acc
    }, [])

    return [jobs, projects, clients]
  }, [data])

  const findByName = useCallback(
    (name: string) => {
      const found = jobs.find(
        ({ name: n }) => n.toLowerCase() === name.toLowerCase()
      )

      return found
    },
    [jobs]
  )

  return {
    jobs,
    projects,
    clients,
    isLoading,
    refetch,
    findByName,
  }
}

export default usePeopleData

export interface Entity {
  id: string
  name: string
}

export interface Job extends Entity {
  projectId: string
  projectName: string
  clientId: string
  clientName: string
}

export interface Project extends Entity {
  jobs: Job[]
  clientId: string
  clientName: string
}

export interface Client extends Entity {
  projects: Project[]
}
