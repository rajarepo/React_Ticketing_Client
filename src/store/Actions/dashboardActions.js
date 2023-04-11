import { axios, getDashboardConfig } from 'lib'
import { getMultiData } from 'store/Slices/dashboardSlice'

export const getDashboardMultiData = () => {
  return async (dispatch) => {
    const { url, config } = getDashboardConfig()
    const res = await axios.get(url, config)
    dispatch(getMultiData(res?.data?.data))
  }
}
