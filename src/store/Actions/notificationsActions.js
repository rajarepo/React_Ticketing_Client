import {
  axios,
  getAllNotificationsConfig,
  getNotificationByIdConfig,
  setReadNotificationConfig,
} from 'lib'
import {
  getNotificationId,
  getNotificationLists,
  getUnreadNotifications,
  setNotificationsLoading,
} from 'store/Slices/notificationsSlice'

export const getAllNotifications = (userId) => {
  return async (dispatch) => {
    const { url, defaultData, config } = getAllNotificationsConfig(userId)
    const res = await axios.post(url, defaultData, config)
    if (res?.status === 200) {
      dispatch(getNotificationLists(res.data.data))
    }
  }
}

export const getAllUnreadNotifications = (userId) => {
  return async (dispatch) => {
    await dispatch(setNotificationsLoading(true))
    const { url, defaultData, config } = getAllNotificationsConfig(userId)
    const res = await axios.post(url, defaultData, config)
    if (res?.status === 200) {
      const filterUnread = res.data.data?.filter(
        (notification) =>
          notification?.isRead === false || notification?.isRead === null
      )
      await dispatch(getUnreadNotifications(filterUnread))
      await dispatch(setNotificationsLoading(false))
    }
  }
}

export const getNotificationById = (id) => {
  return async (dispatch) => {
    await dispatch(setNotificationsLoading(true))
    const { url, defaultData, config } = getNotificationByIdConfig(id)
    const res = await axios.post(url, defaultData, config)
    if (res?.status === 200) {
      console.log(res.data.data[0]);
      await dispatch(getNotificationId(res.data.data[0]))
      await dispatch(setNotificationsLoading(false))
    }
  }
}

export const setReadNotification = (userId) => {
  return async (dispatch) => {
    const { url, config } = setReadNotificationConfig(userId)
    await axios.put(url, null, config)
  }
}
