import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  allNotifications: [],
  allUnreadNotifications: [],
  notificationsLoading: false,
  activeButton: null,
  notificationById: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    getNotificationLists: (state, { payload }) => {
      state.allNotifications = payload
    },
    getUnreadNotifications: (state, { payload }) => {
      state.allUnreadNotifications = payload
    },
    setNotificationsLoading: (state, { payload }) => {
      state.notificationsLoading = payload
    },
    setActiveButton: (state, { payload }) => {
      state.activeButton = payload
    },
    getNotificationId: (state, { payload }) => {
      state.notificationById = payload
    },
  },
})

const { reducer, actions } = notificationsSlice
export const {
  getNotificationLists,
  getUnreadNotifications,
  setNotificationsLoading,
  setActiveButton,
  getNotificationId,
} = actions

export default reducer
