import { Ticket as TicketIcon } from 'icons'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getTicketById } from 'store'
import { Spin } from 'antd'
import { Communication } from './sections'
import { Link } from 'react-router-dom'
import { getUsersByDepartmentID } from 'store'
import moment from 'moment'
import { getTimeDiff } from 'lib'

export function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export const Details = () => {
  const dispatch = useDispatch()
  const { detailsLoading, ticket } = useSelector((state) => state?.tickets)
  const { usersLoading } = useSelector((state) => state?.departments)
  const { users, clients } = useSelector((state) => state?.users)
  const { id } = useParams()

  const createdByAdmin = users?.find((user) => user?.id === ticket?.createdBy)

  useEffect(() => {
    ;(async () => {
      if (id) {
        await dispatch(getTicketById(id, true))
      }
    })()
  }, [id])

  useEffect(() => {
    ;(async () => {
      if (ticket?.departmentId) {
        await dispatch(getUsersByDepartmentID({ id: ticket?.departmentId }))
      }
    })()
  }, [ticket])

  return (
    <>
      {id ? (
        <div className="ticket-wrap bg-[#1E1E2D] text-[#ffffff] p-[40px] rounded-[8px]">
          {ticket === null && !detailsLoading && !usersLoading ? (
            <></>
          ) : detailsLoading || usersLoading ? (
            <div className="text-center">
              <Spin
                size="large"
                style={{ gridColumn: '1/3', alignSelf: 'center' }}
              />
            </div>
          ) : (
            <div className="bg-[#1E1E2D] text-white rounded-[8px] pb-10">
              {/* Header */}
              <div className="pb-10 flex gap-8 items-center">
                <div className="w-[80px] flex items-center">
                  <div className="w-[80px] h-[80px] rounded bg-[#1C3238] tick p-[20px]">
                    <TicketIcon />
                  </div>
                </div>
                <div>
                  <h3
                    className="ticket-title text-2xl mb-2 text-white"
                    title={`${ticket?.ticketTitle} - ${
                      ticket?.ticketStatus === 0
                        ? 'Active'
                        : ticket?.ticketStatus === 1
                        ? 'Waiting'
                        : ticket?.ticketStatus === 2
                        ? 'Closed'
                        : 'Closed and Locked'
                    }`}
                  >
                    {ticket?.ticketTitle}
                    <span className="mx-1"> - </span>
                    <span
                      className={
                        ticket?.ticketStatus === 0
                          ? 'text-[#0BB783]'
                          : ticket?.ticketStatus === 1
                          ? 'text-[#FFA400]'
                          : 'text-[#DD3224]'
                      }
                    >
                      {ticket?.ticketStatus === 0
                        ? 'Active'
                        : ticket?.ticketStatus === 1
                        ? 'Waiting'
                        : ticket?.ticketStatus === 2
                        ? 'Closed'
                        : 'Closed and Locked'}
                    </span>
                  </h3>
                  <div className="flex gap-2 text-[#474761] items-center">
                    <p>
                      {!ticket?.incomingFromClient && createdByAdmin?.fullName
                        ? createdByAdmin?.fullName
                        : ticket?.clientFullName
                        ? ticket?.clientFullName
                        : 'N/A'}
                    </p>
                    <Link
                      to={
                        !ticket?.incomingFromClient && createdByAdmin?.fullName
                          ? `/admin/dashboard/settings/users/list/admin-details/${createdByAdmin?.id}`
                          : `/admin/dashboard/billing/clients/list/details/${
                              clients?.find(
                                (client) =>
                                  client?.fullName === ticket?.clientFullName
                              )?.id
                            }`
                      }
                      className={`${
                        !ticket?.incomingFromClient && createdByAdmin?.fullName
                          ? 'bg-[#2F264F] text-[#8950FC]'
                          : 'bg-[#392F28] text-[#FFA800]'
                      } rounded-[4px] text-[14px] px-[8px] py-[4px] mr-2`}
                    >
                      {!ticket?.incomingFromClient && createdByAdmin?.fullName
                        ? 'Admin'
                        : ticket?.clientFullName
                        ? 'Client'
                        : 'N/A'}
                    </Link>
                    <p>
                      Updated {getTimeDiff(ticket?.lastModifiedOn)} ago -{' '}
                      {moment(ticket?.createdOn)?.format('LLL')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b-2 border-dashed border-[#323248]" />
              <Communication />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
