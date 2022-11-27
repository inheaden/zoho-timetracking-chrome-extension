import { useQuery } from 'react-query'
import { useAPI } from '../api/index'
import useAuthState from '../store/auth'

function useJobs() {
  const { token, email } = useAuthState()
  const { getJobs } = useAPI()

  return useQuery('jobs', getJobs, {
    enabled: !!token && !!email,
  })
}

export default useJobs
