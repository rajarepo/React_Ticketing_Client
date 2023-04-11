/* eslint-disable eqeqeq */
import { Button, ChartPie } from 'components'
import Dropdown from 'components/Dropdown/DropDown'
import React, { useEffect, useState, useMemo } from 'react'
import { Switch } from 'antd'
import {
  getDashboardMultiData,
  getUserSettingsById,
  updateAutoBillState,
  getCurrentCreditBalance,
} from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { BellFilledIcon, TicketIcon, WalletIcon } from 'icons'
import {
  getAllUnreadNotifications,
  setReadNotification,
} from 'store/Actions/notificationsActions'
import moment from 'moment'
import NotificationsModal from 'components/Modal/NotificationsModal.component'

const COLORS = ['#F64E60', '#FFA800']
const COLORS1 = ['#0BB783', '#F64E60', '#FFA800']
const COLORS2 = ['#8950FC', '#3699FF']

function Home() {
  const localData = localStorage.getItem('CurrentUser__client')
  let userId = ''
  if (localData == null || localData === undefined) {
    userId = ''
  } else {
    const data = JSON.parse(localData)
    userId = data.id
  }

  const [data, setData] = useState([
    { name: 'Group A', value: 1 },
    { name: 'Group B', value: 1 },
  ])
  const [data1, setData1] = useState([
    { name: 'Group A', value: 100 },
    { name: 'Group B', value: 150 },
    { name: 'Group C', value: 750 },
  ])
  const [data2, setData2] = useState([
    { name: 'Group A', value: 1 },
    { name: 'Group B', value: 1 },
  ])

  const [statistics, setStatistics] = useState({
    invoice: 0,
    product: 0,
  })

  const [ticketData, setTicket] = useState()

  const [autoBill, setAutoBill] = useState(false)
  const [activeButton, setActiveButton] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [isShowNotificationsModal, setIsShowNotificationsModal] =
    useState(false)
  const [notifications, setNotifications] = useState([])
  const dispatch = new useDispatch()

  const {
    ticketLists,
    ticketStatistics,
    productSvcStatistics,
    invoiceStatistics,
  } = useSelector((state) => state?.dashboard)
  const userSettings = useSelector((state) => state?.users.userSettings)
  const currentCreditBalance = useSelector(
    (state) => state?.bills.currentCreditBalance
  )
  const { allUnreadNotifications, notificationsLoading } = useSelector(
    (state) => state?.notification
  )

  const updateAutoBill = async () => {
    const oldState = autoBill
    setAutoBill(!oldState)
    await dispatch(
      updateAutoBillState({ id: userSettings?.id, state: !oldState })
    )
  }

  useEffect(() => {
    dispatch(getDashboardMultiData())
    dispatch(getCurrentCreditBalance())
    dispatch(getUserSettingsById(userId))
    dispatch(getAllUnreadNotifications(userId))
  }, [])

  useMemo(() => {
    if (!invoiceStatistics) return
    let total = invoiceStatistics?.unPaidCount + invoiceStatistics?.overdueCount
    setData([
      { name: 'Group A', value: invoiceStatistics?.unPaidCount / total },
      { name: 'Group B', value: invoiceStatistics?.overdueCount / total },
    ])
    setStatistics({
      ...statistics,
      invoice: total,
    })
  }, [invoiceStatistics])

  useMemo(() => {
    if (!ticketStatistics) return
    let total =
      ticketStatistics?.watingToAgentCount +
      ticketStatistics?.watingToClientCount
    setData2([
      { name: 'Group A', value: ticketStatistics?.watingToAgentCount / total },
      { name: 'Group B', value: ticketStatistics?.watingToClientCount / total },
    ])
    setTicket(total)
  }, [ticketStatistics])

  useMemo(() => {
    if (!productSvcStatistics) return

    let total =
      productSvcStatistics?.activeCount +
      productSvcStatistics?.pendingCount +
      productSvcStatistics?.suspendedCount
    if (total === 0) total = 1
    setData1([
      { name: 'Group A', value: productSvcStatistics?.activeCount / total },
      { name: 'Group B', value: productSvcStatistics?.pendingCount / total },
      { name: 'Group C', value: productSvcStatistics?.suspendedCount / total },
    ])
    setStatistics({
      ...statistics,
      product: total,
    })
  }, [productSvcStatistics])

  useMemo(() => {
    setAutoBill(userSettings?.autoBill)
  }, [userSettings])

  useMemo(() => {
    setNotifications(allUnreadNotifications)
  }, [allUnreadNotifications])

  const handleMarkRead = async (id) => {
    setIsShowNotificationsModal(false)
    setActiveButton((prev) => [...prev, id])
    await dispatch(setReadNotification(id))
    await dispatch(getAllUnreadNotifications(userId))
  }

  const handleShowModal = (id) => {
    setActiveId(id)
    setIsShowNotificationsModal(true)
  }

  return (
    <div className="p-4 md:px-6">
      <div
        className={`flex flex-col space-y-[20px] ${
          notifications?.length > 0 ? 'mb-[40px]' : null
        }`}
      >
        {notifications?.slice(0, 2)?.map((item) => (
          <div key={item?.id}>
            {isShowNotificationsModal && activeId === item?.id && (
              <NotificationsModal
                id={item?.id}
                setShowModal={setIsShowNotificationsModal}
                body={item?.body}
                sentAt={item?.sentAt}
                tickets={item?.tickets}
                handleMarkRead={handleMarkRead}
              />
            )}
            <div
              className={`${
                activeButton.includes(item?.id) && notificationsLoading
                  ? 'bg-[#28283a]'
                  : 'bg-[#1E1E2D]'
              } flex justify-between p-[10px] space-x-[97px] rounded-[8px]`}
            >
              <div
                className="flex items-center space-x-[20px] cursor-pointer"
                onClick={() => handleShowModal(item?.id)}
              >
                <div className="flex  items-center justify-center rounded-[8px] bg-[#212E48] w-[44px] h-[44px]">
                  <BellFilledIcon />
                </div>
                <div className="flex items-center text-white">
                  {item?.title}
                </div>
                <div className="flex  h-[36px] border-r border-dashed border-[#323248]"></div>
                <div className="flex text-[#7575a1]">{item?.body}</div>
              </div>
              <div className="flex space-x-[20px] items-center">
                <div className="text-[#3699FF]">
                  {moment(item?.sentAt).format('ddd, MMMM Do YYYY . hh:mm a')}
                </div>
                <Button
                  type="secondary"
                  onClick={() => handleMarkRead(item?.id)}
                  loading={
                    activeButton.includes(item?.id) && notificationsLoading
                  }
                >
                  Mark Read
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 min-w-[1340px] gap-[20px] mt-[40px]">
        {/* table list */}
        <div className="col-span-2 h-fit	  bg-[#1E1E2D] rounded-[8px]">
          <div className="border-b border-dashed border-[#323248] p-[20px]">
            <span className="text-white">Recent Support Tickets</span>
          </div>
          <div className="flex flex-col space-y-[10px] p-[20px]">
            {ticketLists.map((item, index) => (
              <div
                key={index}
                className="flex justify-between px-[10px] py-[20px]  bg-[#1A1A27]  rounded-[8px]"
              >
                <div className="flex items-center space-x-[20px]">
                  <div className="flex  items-center justify-center rounded-[8px] bg-[#1C3238] w-[44px] h-[44px]">
                    <TicketIcon />
                  </div>
                  <div className="flex flex-col text-white">
                    <span className="text-base">{item.title}</span>
                    <span className="text-sm text-[#474761]">
                      {item.departmentName}
                    </span>
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex items-center space-x-[20px]">
                    <span className="text-sm text-[#474761]">
                      {item.assignedTo}
                    </span>
                    <div className="flex  h-[36px] border-r border-dashed border-[#323248]"></div>
                    <span className="text-sm text-[#474761]">
                      {item.messageCount} Messages
                    </span>
                    <div className="flex  h-[36px] border-r border-dashed border-[#323248]"></div>
                    <span className="text-sm text-[#474761]">
                      {item.idleTime} Mins Idle Time
                    </span>
                    {item.status == 'Active' && (
                      <div
                        className={`bg-[#1C3238] text-[#0BB783] px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
                      >
                        {item.status}
                      </div>
                    )}
                    {item.status == 'Pending' && (
                      <div
                        className={`bg-[#392F28] text-[#FFA800] px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
                      >
                        {item.status}
                      </div>
                    )}
                    {item.status == 'Closed' && (
                      <div
                        className={`bg-[#3A2434] text-[#F64E60] px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
                      >
                        {item.status}
                      </div>
                    )}
                    {item.status == 'Closed and Locked' && (
                      <div
                        className={`bg-[#3A2434] text-[#F64E60] px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
                      >
                        {item.status}
                      </div>
                    )}
                    <Dropdown id={item.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* payment state */}
        <div className="flex flex-col space-y-[20px]">
          <div className="flex flex-col space-y-[20px] p-[20px] bg-[#1E1E2D] rounded-[8px]">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-white">Account Balance</span>
                <span className="text-[32px] text-[#0BB783]">
                  ${currentCreditBalance}
                </span>
              </div>
              <div className="flex  items-center justify-center rounded-[8px] bg-[#1C3238] w-[69px] h-[69px]">
                <WalletIcon />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button>Choose Payment Method</Button>
              <div className="flex items-center gap-[12px]">
                <span className="text-sm text-[#92928F]">Auto Billing</span>
                <Switch checked={autoBill} onChange={updateAutoBill} />
              </div>
            </div>
          </div>
          {/* pie chart1 */}
          <div className="flex justify-between p-[20px] bg-[#1E1E2D] rounded-[8px]">
            <div className="flex items-center space-x-[20px]">
              <div className="w-[100px] h-[100px]">
                <ChartPie data={data} colors={COLORS}></ChartPie>
              </div>
              <div className="flex  flex-col space-x-[20px]">
                <span className="text-sm text-white">Outstanding Invoices</span>
                <span className="text-[10px] text-[#8787a2] m-0">
                  {statistics.invoice} Invoices
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-[8px] w-[160px] px-[20px] bg-[#1A1A27] rounded-[8px] ">
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#FFA800] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#FFA800]"></div>
                <span className="text-[10px] text-white">UNPAID</span>
              </div>
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#F64E60] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#F64E60]"></div>
                <span className="text-[10px] text-white">OVERIDUE</span>
              </div>
            </div>
          </div>

          {/* pie chart2 */}
          <div className="flex justify-between p-[20px] bg-[#1E1E2D] rounded-[8px]">
            <div className="flex items-center space-x-[20px]">
              <div className="w-[100px] h-[100px]">
                <ChartPie data={data1} colors={COLORS1}></ChartPie>
              </div>
              <div className="flex  flex-col space-x-[20px]">
                <span className="text-sm text-white">Products & Services</span>
                <span className="text-[10px] text-[#8787a2] m-0">
                  {statistics.product} Products & Services
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-[8px] w-[160px] px-[20px] bg-[#1A1A27] rounded-[8px] ">
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#0BB783] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#0BB783]"></div>
                <span className="text-[10px] text-white">ACTIVE</span>
              </div>
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#FFA800] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#FFA800]"></div>
                <span className="text-[10px] text-white">SUSPENDED</span>
              </div>
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#F64E60] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#F64E60]"></div>
                <span className="text-[10px] text-white">PENDING</span>
              </div>
            </div>
          </div>

          {/* pie chart3 */}
          <div className="flex justify-between p-[20px] bg-[#1E1E2D] rounded-[8px]">
            <div className="flex items-center space-x-[20px]">
              <div className="w-[100px] h-[100px]">
                <ChartPie data={data2} colors={COLORS2}></ChartPie>
              </div>
              <div className="flex  flex-col space-x-[20px]">
                <span className="text-sm text-white">Open Tickets</span>
                <span className="text-[10px] text-[#8787a2] m-0">
                  {ticketData} Tickets
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-[8px] w-[160px] px-[20px] bg-[#1A1A27] rounded-[8px] ">
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#3699FF] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#3699FF]"></div>
                <span className="text-[10px] text-white">WAITING FOR YOU</span>
              </div>
              <div className="flex  items-center space-x-[10px] bg-[#1A1A27] rounded-[8px]">
                <div className="bg-[#8950FC] w-[6px] h-[6px] rounded-[3px] shadow-[0px_2px_4px_#8950FC]"></div>
                <span className="text-[10px] text-white">
                  WAITING FOR AGENT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
