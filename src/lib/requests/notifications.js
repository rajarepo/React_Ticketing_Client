import { getConfig } from 'lib'
const notificationConfig = (action) =>
  getConfig({ module: 'Notifications', action })

const prefix = `api/v1/client/notifications`

export const getAllNotificationsConfig = (userId) => {
  return {
    url: `${prefix}/all`,
    defaultData: {
      advancedSearch: {
        fields: ['toUserId'],
        keyword: userId,
      },
      orderBy: ['sentAt'],
    },
    config: notificationConfig('Read'),
  }
}

export const setReadNotificationConfig = (userId) => {
  return {
    url: `${prefix}/${userId}/read`,
    config: notificationConfig('Update'),
  }
}

export const getNotificationByIdConfig = (id) => {
  return {
    url: `${prefix}/all`,
    defaultData: {
      advancedSearch: {
        fields: ['id'],
        keyword: id,
      },
      pageSize: 0,
      orderBy: ['sentAt'],
    },
    config: notificationConfig('Read'),
  }
}