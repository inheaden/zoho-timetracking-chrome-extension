import { useQuery } from 'react-query'
import { useAPI } from '../api/index'
import useAuthState from '../store/auth'

function useTimelogs() {
  const { token, email } = useAuthState()
  const { getTimelogs } = useAPI()

  return useQuery('timelogs', getTimelogs, {
    enabled: !!token && !!email,
  })
}

export default useTimelogs
