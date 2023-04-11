import { Bell } from 'icons'
import UserName from 'layout/components/navbar/UserProfileCard/UserName'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  getAllNotifications,
  setReadNotification,
} from 'store/Actions/notificationsActions'
import './Notifications.style.scss'
import { List, Spin } from 'antd'
import NotificationsModal from 'components/Modal/NotificationsModal.component'

function Notifications() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state?.auth)
  const { allNotifications } = useSelector((state) => state?.notification)

  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Today')
  const [all, setAll] = useState([])
  const [today, setToday] = useState([])
  const [week, setWeek] = useState([])
  const [month, setMonth] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    dispatch(getAllNotifications())
  }, [])

  useMemo(async () => {
    const byToday = []
    const byWeek = []
    const byMonth = []

    await allNotifications?.forEach((notification) => {
      setLoading(true)

      if (
        moment(notification?.sentAt).isSame(
          moment.utc().format('yyyy-MM-D'),
          'day'
        )
      ) {
        byToday.push(notification)
      }

      if (
        moment(notification?.sentAt).isSame(
          moment.utc().format('yyyy-MM-D'),
          'week'
        )
      ) {
        byWeek.push(notification)
      }

      if (
        moment(notification?.sentAt).isSame(
          moment.utc().format('yyyy-MM-D'),
          'month'
        )
      ) {
        byMonth.push(notification)
      }

      setLoading(false)
    })

    setToday(byToday)
    setWeek(byWeek)
    setMonth(byMonth)
    setAll(allNotifications)
  }, [allNotifications])

  const handleOnClick = (name) => {
    setActiveFilter(name)
  }

  const handleMarkRead = (id) => {
    setShowModal(false)
    dispatch(setReadNotification(id))
    dispatch(getAllNotifications())
  }

  const ListFilter = [
    { name: 'Today' },
    { name: 'Week' },
    { name: 'Month' },
    { name: 'All' },
  ]

  return (
    <div className="p-10 flex flex-col gap-[20px]">
      {/* User */}
      <div className="p-8 bg-[#1E1E2D] rounded-lg text-white flex gap-8 items-center">
        <div className="w-[130px] h-[130px] bg-[#1A1A27] rounded-lg">
          {user?.imageUrl ? (
            <img
              src={user?.imageUrl}
              alt={user?.fullName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-4xl font-bold flex items-center justify-center h-full bg-[#1A1A27] rounded-lg">
              {<UserName user={user} />}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-2xl mb-2">{user?.fullName}</p>
          <p className="text-[#474761] text-base">
            {user?.address1} . <span>{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1E1E2D] rounded-lg text-white">
        <div className="flex border-b-[2px] border-dashed border-[#323248] justify-between items-center px-8">
          <div className="flex gap-3 items-center">
            <img
              src="/icon/dashboard/calendar.svg"
              alt="calendar"
              className="w-10 h-10 p-2 rounded-lg bg-[#212E48]"
            />
            <p className="text-base">
              {moment().utc().format('MMMM Do, yyyy')}
            </p>
          </div>

          <div className="flex">
            {ListFilter.map((list) => (
              <p
                key={list.name}
                className={`${
                  activeFilter === list.name &&
                  'border-b-[3px] border-[#3699FF]'
                } cursor-pointer py-8 px-4`}
                onClick={() => handleOnClick(list.name)}
              >
                {list.name}
              </p>
            ))}
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="text-center">
              <Spin size="large"></Spin>
            </div>
          ) : (
            <>
              {activeFilter === 'Today' && (
                <div className={'ticket-list-wrap custom-table__table mt-0'}>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
                    }}
                    dataSource={today}
                    renderItem={(notification) => (
                      <div
                        key={notification?.id}
                        className="flex justify-between items-center mb-4"
                      >
                        {/* Notification Modal */}
                        {showModal && activeId === notification?.id && (
                          <NotificationsModal
                            id={notification?.id}
                            isRead={notification?.isRead}
                            setShowModal={setShowModal}
                            body={notification?.body}
                            sentAt={notification?.sentAt}
                            tickets={notification?.tickets}
                            handleMarkRead={handleMarkRead}
                            setActiveId={setActiveId}
                          />
                        )}

                        <div className="flex items-center gap-1 relative">
                          <div
                            className={`bg-[#323248] rounded-full p-[12px] ${
                              notification?.isRead
                                ? null
                                : 'unread-notification'
                            }`}
                          >
                            <Bell fill={'#fff'} />
                          </div>
                          <p
                            onClick={() => {
                              setShowModal(true)
                              setActiveId(notification?.id)
                            }}
                            className="cursor-pointer text-white hover:text-[#3699FF] p-2"
                          >
                            {notification?.body}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex">
                            {notification?.userImage && (
                              <img
                                alt={notification?.fullName}
                                src={notification?.userImage}
                                className="w-[20px] h-[20px] object-cover rounded-[50%]"
                              />
                            )}
                            <div className={`text-[#474761] ml-2`}>{`${
                              notification?.fullName
                            } added at ${moment(notification?.sentAt).format(
                              'hh:mm A'
                            )}`}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}

              {activeFilter === 'Week' && (
                <div className={'ticket-list-wrap custom-table__table mt-0'}>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
                    }}
                    dataSource={week}
                    renderItem={(notification) => (
                      <div
                        key={notification?.id}
                        className="flex justify-between items-center mb-4"
                      >
                        {/* Notification Modal */}
                        {showModal && activeId === notification?.id && (
                          <NotificationsModal
                            id={notification?.id}
                            isRead={notification?.isRead}
                            setShowModal={setShowModal}
                            body={notification?.body}
                            sentAt={notification?.sentAt}
                            tickets={notification?.tickets}
                            handleMarkRead={handleMarkRead}
                            setActiveId={setActiveId}
                          />
                        )}

                        <div className="flex items-center gap-1 relative">
                          <div
                            className={`bg-[#323248] rounded-full p-[12px] ${
                              notification?.isRead
                                ? null
                                : 'unread-notification'
                            }`}
                          >
                            <Bell fill={'#fff'} />
                          </div>
                          <p
                            onClick={() => {
                              setShowModal(true)
                              setActiveId(notification?.id)
                            }}
                            className="cursor-pointer text-white hover:text-[#3699FF] p-2"
                          >
                            {notification?.body}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex">
                            {notification?.userImage && (
                              <img
                                alt={notification?.fullName}
                                src={notification?.userImage}
                                className="w-[20px] h-[20px] object-cover rounded-[50%]"
                              />
                            )}
                            <div className={`text-[#474761] ml-2`}>{`${
                              notification?.fullName
                            } added at ${moment(notification?.sentAt).format(
                              'MMM Do YYYY . hh:mm a'
                            )}`}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}

              {activeFilter === 'Month' && (
                <div className={'ticket-list-wrap custom-table__table mt-0'}>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
                    }}
                    dataSource={month}
                    renderItem={(notification) => (
                      <div
                        key={notification?.id}
                        className="flex justify-between items-center mb-4"
                      >
                        {/* Notification Modal */}
                        {showModal && activeId === notification?.id && (
                          <NotificationsModal
                            id={notification?.id}
                            isRead={notification?.isRead}
                            setShowModal={setShowModal}
                            body={notification?.body}
                            sentAt={notification?.sentAt}
                            tickets={notification?.tickets}
                            handleMarkRead={handleMarkRead}
                            setActiveId={setActiveId}
                          />
                        )}

                        <div className="flex items-center gap-1 relative">
                          <div
                            className={`bg-[#323248] rounded-full p-[12px] ${
                              notification?.isRead
                                ? null
                                : 'unread-notification'
                            }`}
                          >
                            <Bell fill={'#fff'} />
                          </div>
                          <p
                            onClick={() => {
                              setShowModal(true)
                              setActiveId(notification?.id)
                            }}
                            className="cursor-pointer text-white hover:text-[#3699FF] p-2"
                          >
                            {notification?.body}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex">
                            {notification?.userImage && (
                              <img
                                alt={notification?.fullName}
                                src={notification?.userImage}
                                className="w-[20px] h-[20px] object-cover rounded-[50%]"
                              />
                            )}
                            <div className={`text-[#474761] ml-2`}>{`${
                              notification?.fullName
                            } added at ${moment(notification?.sentAt).format(
                              'MMM Do YYYY . hh:mm a'
                            )}`}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}

              {activeFilter === 'All' && (
                <div className={'ticket-list-wrap custom-table__table mt-0'}>
                  <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                      defaultPageSize: 5,
                      showSizeChanger: true,
                      pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
                    }}
                    dataSource={all}
                    renderItem={(notification) => (
                      <div
                        key={notification?.id}
                        className="flex justify-between items-center mb-4"
                      >
                        {/* Notification Modal */}
                        {showModal && activeId === notification?.id && (
                          <NotificationsModal
                            id={notification?.id}
                            isRead={notification?.isRead}
                            setShowModal={setShowModal}
                            body={notification?.body}
                            sentAt={notification?.sentAt}
                            tickets={notification?.tickets}
                            handleMarkRead={handleMarkRead}
                            setActiveId={setActiveId}
                          />
                        )}

                        <div className="flex items-center gap-1 relative">
                          <div
                            className={`bg-[#323248] rounded-full p-[12px] ${
                              notification?.isRead
                                ? null
                                : 'unread-notification'
                            }`}
                          >
                            <Bell fill={'#fff'} />
                          </div>
                          <p
                            onClick={() => {
                              setShowModal(true)
                              setActiveId(notification?.id)
                            }}
                            className="cursor-pointer text-white hover:text-[#3699FF] p-2"
                          >
                            {notification?.body}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex">
                            {notification?.userImage && (
                              <img
                                alt={notification?.fullName}
                                src={notification?.userImage}
                                className="w-[20px] h-[20px] object-cover rounded-[50%]"
                              />
                            )}
                            <div className={`text-[#474761] ml-2`}>{`${
                              notification?.fullName
                            } added at ${moment(notification?.sentAt).format(
                              'MMM Do YYYY . hh:mm a'
                            )}`}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
