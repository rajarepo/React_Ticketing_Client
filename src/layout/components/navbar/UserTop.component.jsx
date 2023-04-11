import React, { useRef, useState, useEffect } from 'react'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { Link, useNavigate } from 'react-router-dom'
import { loginAsAdmin } from 'store/Actions/AuthActions'
import { logout } from 'store/Slices/authSlice'
import UserName from './UserProfileCard/UserName'
import './UserTop.css'
import { Bell } from 'icons'
import moment from 'moment'
import NotificationsModal from 'components/Modal/NotificationsModal.component'
import {
  getAllUnreadNotifications,
  setReadNotification,
} from 'store/Actions/notificationsActions'
import { useMemo } from 'react'

function UserTop() {
  const [connection] = useState(null)
  const [dropdown, setDropdown] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [notifications, setNotifications] = useState([])

  const { user, isLoggedIn, adminSession } = useSelector((state) => state.auth)
  const [imgError, setImgError] = useState(false)
  const lessThanDesktop = useMediaQuery({
    query: '(max-width: 900px)',
  })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOnline = window.navigator.onLine
  const Roles = user && user?.userRolesResponse
  const isAdmin = adminSession !== undefined || Roles?.userRoles[2]?.enabled || Roles?.userRoles[3]?.enabled
  const { allUnreadNotifications } = useSelector((state) => state?.notification)

  useEffect(() => {
    if (connection) {
      connection.start()
    }
  }, [connection])

  const links = [
    {
      name: 'Account Settings',
      onClick: () => {
        setDropdown((dropdownValue) => !dropdownValue)
        //navigate('/client/dashboard/account-settings');
        navigate('/client/dashboard/account-settings/general')
      },
    },
    {
      name: 'Notifications',
      onClick: () => {
        setDropdown((dropdownValue) => !dropdownValue)
        setShowNotification((prev) => !prev)
      },
    },
    {
      name: 'Sign Out',
      onClick: () => {
        dispatch(logout())
        navigate('/client/sign-in')
      },
    },
    {
      name: 'Sign Out & Return to Admin Panel',
      onClick: () => {
        handleLoginAsAdmin()
      },
    },
  ]

  const handleLoginAsAdmin = useCallback(() => {
    if (adminSession && adminSession.adminId) {
      dispatch(loginAsAdmin(adminSession.adminId))
    }
  }, [dispatch, adminSession])

  const handleMarkRead = (id) => {
    setShowNotificationModal(false)
    dispatch(setReadNotification(id))
    dispatch(getAllUnreadNotifications(user?.id))
  }

  useMemo(() => {
    setNotifications(allUnreadNotifications)
  }, [allUnreadNotifications])

  const dropDownRef = useRef(null)

  return (
    <div
      className="relative flex items-center mr-4 cursor-pointer"
      ref={dropDownRef}
    >
      {showNotification && (
        <div
          className="fixed right-0 top-0 z-10 bg-black/80 w-full flex justify-end cursor-default"
          onClick={() => setShowNotification(false)}
        >
          <div
            className="bg-[#1E1E2D] text-white cursor-default userTopWrap h-screen w-3/5 flex flex-col"
            style={{ boxShadow: '0px 0px 40px #00000066' }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <p className="p-4 text-base border-b-[2px] border-dashed border-[#474761]">
              Notifications
            </p>

            <div className="p-4 h-full overflow-auto pb-20">
              {notifications.length > 0 ? (
                notifications?.slice(0, 10)?.map((notification) => (
                  <div
                    key={notification?.id}
                    className="notification-block pl-[60px] pt-[13px] relative"
                  >
                    {showNotificationModal && activeId === notification?.id && (
                      <NotificationsModal
                        id={notification?.id}
                        setShowModal={setShowNotificationModal}
                        body={notification?.body}
                        sentAt={notification?.sentAt}
                        tickets={notification?.tickets}
                        handleMarkRead={handleMarkRead}
                        setActiveId={setActiveId}
                        setShowNotification={setShowNotification}
                      />
                    )}
                    <div className={`noti-icon`}>
                      <Bell fill={'#fff'} />
                    </div>
                    <div className={`noti-content`}>
                      <div className="flex justify-between">
                        <p
                          className={`cursor-pointer ${
                            activeId === notification?.id
                              ? 'text-[#2671bc] animate-pulse'
                              : 'text-[#3699FF]'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveId(notification?.id)
                            setShowNotificationModal(true)
                          }}
                        >
                          {notification?.body}
                        </p>
                        <div className={`flex`}>
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
                  </div>
                ))
              ) : (
                <p className="text-center">No new notifications</p>
              )}
            </div>

            <Link
              to="/client/dashboard/notifications"
              onClick={() => setShowNotification(false)}
            >
              <p className="bg-[#1E1E2D] p-4 border-t-[2px] border-dashed border-[#474761] text-center text-[#3699FF]">
                View All Notifications
              </p>
            </Link>
          </div>
        </div>
      )}
      <div
        className={`w-[278px] bg-[#1E1E2D] ${
          dropdown ? '' : 'hidden'
        } rounded-lg text-gray-300`}
        style={{
          position: 'absolute',
          top: '58px',
          right: 0,
          boxShadow: '0px 0px 40px #00000066',
          zIndex: 2,
          width: 370,
        }}
      >
        {/* Name and Email Box */}
        <div className="p-[20px] border-b-[1px] border-b-[#323248] cursor-auto">
          <div className="flex items-start justify-between">
            {/* Image + Status */}
            <div className="h-12 w-12 rounded-lg border-2 border-[#3699FF] p-1 userName">
              {user && user.base64Image && !imgError ? (
                // !showName
                <img
                  src={user?.base64Image}
                  alt={user.userName}
                  onError={() => setImgError(true)}
                  className="w-full h-full"
                />
              ) : (
                <>{user && <UserName isLoggedIn={isLoggedIn} user={user} />}</>
              )}
            </div>
          </div>
          <div className="mt-[20px]">
            <h3 className="text-white text-[16px] mb-2">{user?.fullName}</h3>
            <h3 className="text-[#92928F] text-[16px] mb-2">{user?.email}</h3>
          </div>
          <div className="row ">
            <div className="py-[4px]"></div>
            <div className="bg-[#1C3238] px-[8px] py-[4px] rounded-[4px] w-[51px] ml-3 justify-between">
              <p className="text-[#0BB783] text-[10px]">ACTIVE</p>
            </div>
            {isAdmin && (
              <div className="  bg-[#212E48] px-[8px] py-[4px] rounded-[4px] w-[119px] ml-3  justify-between">
                <p className="text-[#3699FF] text-[10px]">
                  LOGGED IN AS CLIENT
                </p>
              </div>
            )}
          </div>
        </div>
        <div>
          {links?.map(({ onClick, name, Icon, active }, index) => {
            if (name === 'Sign Out & Return to Admin Panel' && !isAdmin)
              return null

            return (
              <p
                className={`pt-[20px] px-[20px] ${
                  active ? 'text-[#3699FF]' : 'text-[#92928F]'
                } flex items-center justify-between hover:text-[#3699FF] transition-all text-[12px] last:pb-[20px]`}
                onClick={(e) => onClick(e)}
                key={name}
              >
                <span className="relative w-full">
                  {name}{' '}
                  <span
                    className={
                      name === 'Notifications' && notifications.length > 0
                        ? 'notifications'
                        : null
                    }
                  />
                </span>
                {Icon}
              </p>
            )
          })}
        </div>
      </div>
      <div
        className={`h-12 w-12 rounded-lg border-2 border-[#3699FF] p-1 userName ${
          isOnline ? 'isOnline' : 'isOffline'
        }`}
      >
        {user?.base64Image ? (
          <img
            src={user?.base64Image}
            alt={user.userName}
            className="w-full h-full"
          />
        ) : (
          <>{user && <UserName isLoggedIn={isLoggedIn} user={user} />}</>
        )}
      </div>

      {!lessThanDesktop && (
        <>
          <div
            className="mx-3 text-base"
            onClick={() => {
              setDropdown((prevDropdown) => !prevDropdown)
              setShowNotification(false)
            }}
          >
            <h3 className="mb-0 text-base text-white">
              {user && user.fullName}
            </h3>
            <p className="mb-0 text-gray-400">{user && user.email}</p>
          </div>
          <div
            className="h-12 w-12 bg-[#323248] flex items-center justify-center rounded-lg relative"
            onClick={() => {
              setDropdown((prevDropdown) => !prevDropdown)
              setShowNotification(false)
            }}
          >
            <img src="/icon/arrow-down.svg" alt="" />
          </div>
        </>
      )}
    </div>
  )
}

export default UserTop
