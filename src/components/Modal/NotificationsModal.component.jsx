import { BellFilledIcon } from 'icons'
import moment from 'moment'
import { Link } from 'react-router-dom'

function NotificationsModal({
  id,
  setShowModal,
  body,
  sentAt,
  tickets,
  handleMarkRead,
  setActiveId,
  setShowNotification,
  isRead = false,
}) {
  return (
    <div className="fixed w-full h-full bg-black/70 top-0 left-0 z-10 flex items-center justify-center">
      <div className="rounded-lg bg-[#1E1E2D] text-white w-[512px]">
        <p className="p-8 border-b border-dashed border-[#323248] text-xl">
          Notification Detail
        </p>

        <div className="p-8">
          <div className="bg-[#1A1A27] border-[2px] border-dashed border-[#323248] rounded-lg p-8 text-center flex flex-col">
            <div className="flex items-center justify-center">
              <div className="h-[80px] w-[80px] bg-[#212E48] flex items-center justify-center rounded-[8px] mb-8">
                <BellFilledIcon size={44} />
              </div>
            </div>
            <p className="text-base mb-4">
              {tickets?.length > 0
                ? 'Notification w/ Ticket Attached'
                : 'General Notifications'}
            </p>
            <p className="text-base text-[#474761] mb-2">{body}</p>
            <p className="text-sm text-[#3699FF]">
              {moment(sentAt).format('ddd, MMMM Do YYYY . hh:mm a')}
            </p>
            {tickets?.length > 0 && (
              <div className="flex justify-center mt-4">
                <Link
                  to={`/client/dashboard/support/tickets/details/${tickets[0]?.id}`}
                  onClick={() => {
                    setShowModal(false)
                    setActiveId(null)
                    setShowNotification(false)
                  }}
                >
                  <p className="text-sm w-fit text-[#0BB783] bg-[#1C3238] py-2 px-3 rounded-3xl">
                    View Ticket
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 px-8 pb-8">
          {isRead === true ? null : (
            <button
              className="rounded-lg bg-[#3699FF] p-3 hover:bg-[#3392f1]"
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(false)
                setActiveId(null)
              }}
            >
              Mark Unread
            </button>
          )}
          <button
            className="rounded-lg bg-[#323248] p-3 hover:bg-[#2a2a3d]"
            onClick={(e) => {
              e.stopPropagation()
              if (isRead) {
                setShowModal(false)
              } else {
                handleMarkRead(id)
              }
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationsModal
