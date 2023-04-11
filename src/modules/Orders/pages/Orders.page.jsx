import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Table } from 'components'
import { statusList } from 'lib'
import { checkModule } from 'lib/checkModule'
import { getOrders, getOrdersByClient } from 'store'
import moment from 'moment'
import { getClients, getOrderTemplates } from 'store'
import { Button } from 'antd'
import OrderName from 'layout/components/navbar/OrderProfileCard/OrderName'
import { getSearchOrders } from 'store'
import { getOrderByID } from 'store'

export const Orders = (props) => {
  const { t } = useTranslation('/Bills/ns')
  const { settings } = useSelector((state) => state.appSettings)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { orders, loading, paginationProps } = useSelector(
    (state) => state?.orders
  )
  const { userModules } = useSelector((state) => state?.modules)
  const { user } = useSelector((state) => state?.auth)
  const [paginationData, setPaginationData] = useState({})
  const [id, setId] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { id } = JSON.parse(localStorage.getItem('CurrentUser__client'))
      await dispatch(getOrders(id))
      setId(id)
    })()
  }, [dispatch, props.sucess])

  // Setting data properly
  const [data, setData] = useState([])
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [defaultData, setDefaultData] = useState('')

  const { permissions } = checkModule({
    module: 'Orders',
    modules: userModules,
  })

  useEffect(() => {
    setData([])
    if (orders?.length) {
      const dataToSet = orders?.map((b) => {
        return {
          ...b,
          fullName: b?.clientFullName,
          key: b?.id,
        }
      })
      setData(dataToSet)
    }
  }, [orders])

  const AdvancedSearchOptions = {
    searchValues: {
      orderNo: '',
      dateAdded: '',
      status: '',
      total: '',
      client: '',
      admin: '',
      numResult: 100,
      title: '',
    },
    fields: [
      {
        label: 'Order Number',
        name: 'orderNo',
        type: 'number',
        variant: 'number',
        placeholder: 'Enter Order Number...',
      },
      {
        label: 'Amount',
        name: 'total',
        type: 'number',
        variant: 'text',
        placeholder: 'Enter Amount...',
      },
      {
        label: 'Status',
        name: 'status',
        type: 'select',
        variant: 'select',
        options: [
          { label: 'Any', value: '' },
          { label: 'Pending', value: 0 },
          { label: 'Active', value: 1 },
          { label: 'Cancelled', value: 2 },
          { label: 'Suspended', value: 3 },
          { label: 'Completed', value: 4 },
          { label: 'Accepted', value: 5 },
          { label: 'Draft', value: 6 },
        ],
      },
      {
        label: 'Search String',
        name: 'title',
        type: 'text',
        variant: 'text',
        placeholder: 'Enter Search String…',
      },
      {
        label: 'Max Results',
        name: 'numResult',
        type: 'number',
        variant: 'text',
      },
      {
        label: 'Date',
        name: 'dateAdded',
        type: 'date',
        variant: 'dateRange',
        placeholder: '12-13-2022',
      },
    ],
  }

  const columns = [
    {
      title: t('orderId'),
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: t('client'),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => {
        return (
          <div className="flex items-center gap-[16px]">
            {record && record.base64Image && !imgError ? (
              <div className="bg-[#171723] flex items-center justify-center w-[47px] h-[47px] rounded-lg p-[4px]">
                <img
                  className="w-full h-full rounded-lg"
                  src={record?.base64Image}
                  alt="user"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="bg-[#171723] flex items-center justify-center min-w-[47px] h-[47px] rounded-lg p-[4px] text-[#0BB783] text-[18px] font-bold">
                <>
                  {record && (
                    <OrderName isLoggedIn={isLoggedIn} order={record} />
                  )}
                </>
              </div>
            )}
            <p className="text-white text-[14px]">{record?.fullName}</p>
          </div>
        )
      },
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => (a?.status > b?.status ? 0 : 3),
      render: (status) => {
        let color = ''
        let text = ''
        switch (status) {
          case 0:
            color = 'bg-[#392F28] text-[#FFA800]'
            text = 'PENDING'
            break
          case 1:
            color = 'bg-[#1C3238] text-[#0BB783]'
            text = 'ACTIVE'
            break
          case 2:
            color = 'bg-[#323248] text-[#FFFFFF]'
            text = 'CANCELLED'
            break
          case 3:
            color = 'bg-[#3A2434] text-[#F64E60]'
            text = 'SUSPENDED'
            break
          default:
            color = ''
            text = 'UNKNOWN'
        }
        return (
          <div
            className={`${color} px-[8px] py-[4px] w-[fit-content] rounded-[4px]`}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: t('total'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice) => {
        return <>{`${totalPrice} USD`}</>
      },
    },
    {
      title: t('dateAdded'),
      dataIndex: 'createdOn',
      key: 'createdOn',
      sorter: (a, b) => (moment(a?.createdOn) < moment(b?.createdOn) ? -1 : 1),
      render: (text, record) =>
        record?.createdOn !== 'N/A'
          ? moment(record?.createdOn).format('MMMM Do, YYYY')
          : 'N/A',
    },
    {
      title: t('dateModified'),
      dataIndex: 'lastModifiedOn',
      key: 'lastModifiedOn',
      sorter: (a, b) =>
        moment(a?.lastModifiedOn) < moment(b?.lastModifiedOn) ? -1 : 1,
      render: (text, record) =>
        record?.lastModifiedOn !== 'N/A'
          ? moment(record?.lastModifiedOn).format('MMMM Do, YYYY')
          : 'N/A',
    },
  ]

  const onPaginationChange = (data) => {
    const { current, pageSize } = data
    const paginationData = {
      keyword: '',
      pageNumber: current,
      pageSize: pageSize,
      orderBy: [''],
      clientId: id,
    }
    data && current && pageSize && dispatch(getSearchOrders(paginationData))
  }

  const advancedSearchHandler = (e, values, paginationData) => {
    e.preventDefault()
    const defaultData = {
      orderNo: values?.orderNo ? values?.orderNo : null,
      amount: values.total ? parseInt(values?.total) : null,
      orderStatus: values.status ? parseInt(values.status) : null,
      keyword: values?.title ? values?.title : '',
      pageSize: values?.numResult ? parseInt(values?.numResult) : 2,
      startDate: values?.dateAdded[0] ? values?.dateAdded[0] : null,
      endDate: values?.dateAdded[1] ? values?.dateAdded[1] : null,
      clientId: id,
    }
    dispatch(getSearchOrders(defaultData))
    setDefaultData(defaultData)
    setPaginationData(paginationData)
  }

  return (
    <div className="p-[40px]">
      <div className="p-[40px] pb-[24px] bg-[#1E1E2D] rounded-[8px]">
        <Table
          AdvancedSearchOptions={AdvancedSearchOptions}
          columns={columns}
          data={data}
          loading={loading}
          pagination={
            paginationProps
              ? paginationProps
              : {
                  defaultPageSize: 5,
                  showSizeChanger: true,
                  position: ['bottomLeft'],
                  pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
                  current: 1,
                }
          }
          onPaginationChange={onPaginationChange}
          advancedSearchHandler={advancedSearchHandler}
          fieldToFilter="orderNo"
          handleStatus={async (values) => {
            setStatus(values)
            let details = {
              status: values,
              userId: user?.id,
            }

            if (startDate && endDate) {
              details['startDate'] = startDate
              details['endDate'] = endDate
            }
            await dispatch(getOrders(details))
          }}
          handleDateRange={async (date, dateString, id) => {
            let startDate = ''
            let endDate = ''
            let details = {
              userId: user?.id,
            }
            if (date) {
              startDate = date[0]._d
              endDate = date[1]._d
              details['startDate'] = startDate
              details['endDate'] = endDate
            }

            if (status) {
              details['status'] = status
            }

            setStartDate(startDate)
            setEndDate(endDate)
            await dispatch(getOrders(details))
          }}
          permissions={permissions}
          t={t}
          viewAction={(record) => {
            return (
              <>
                <Button
                  onClick={() => {
                    navigate(`./detail/${record?.id}`)
                    dispatch(getOrderByID(record?.id))
                  }}
                >
                  View Details
                </Button>
                <Button
                  onClick={() => {
                    navigate(
                      `/client/dashboard/billing/detail/${record.billId}`
                    )
                  }}
                >
                  View Invoice
                </Button>
              </>
            )
          }}
        />
      </div>
    </div>
  )
}
