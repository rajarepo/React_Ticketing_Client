import { useDispatch, useSelector } from 'react-redux'
import { Table, TicketMenu } from 'components'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { checkModule } from 'lib/checkModule'
import './styles.scss'
import { getLoggedInUserAssignTickets } from 'store'
import { getUsers } from 'store'
import { getClients } from 'store'
import { Button } from 'antd'
import { axios, getTicketsConfig } from 'lib'
import { TicketSearch } from 'modules/KnowledgeBase/pages/Articles/pages/View/sections/AdvancedSearch/AdvancedSearch'
import moment from 'moment/moment'

export const RelatedList = ({ queueList, isSearch, AdvancedSearchOptions }) => {
  const { allTickets, loading } = useSelector((state) => state?.tickets)
  const localData = localStorage.getItem('CurrentUser__client')
  let userId = ''
  if (localData == null || localData === undefined) {
    userId = ''
  } else {
    const data = JSON.parse(localData)
    userId = data.id
  }
  // const departmentsLoading = useSelector((state) => state?.departments?.loading)
  const { user } = useSelector((state) => state?.auth)
  const { deptId } = useParams()
  const tickets = allTickets
  const [searchData, setSearchData] = useState('')

  const currentRoute = ({ id = '' }) =>
    `/client/dashboard/support/tickets/details/${id}`

  const { userModules } = useSelector((state) => state?.modules)

  const { permissions } = checkModule({
    module: 'Tickets',
    modules: userModules,
  })

  // Setting data properly
  const [data, setData] = useState([])

  const [permissionsData, setPermissionsData] = useState(null)

  useEffect(() => {
    setPermissionsData(permissions)
  }, [userModules])

  useEffect(() => {
    setData([])
    if (tickets?.length) {
      const dataToSet = tickets?.map((b) => {
        return {
          ...b,
          key: b?.id,
        }
      })
      const trueFirst = dataToSet
        ?.sort(
          (a, b) =>
            new Date(b?.lastModifiedOn).getTime() -
            new Date(a?.lastModifiedOn).getTime()
        )
        ?.sort((a, b) =>
          a?.pinTicket === b?.pinTicket ? 0 : a?.pinTicket ? -1 : 1
        )

      setData(trueFirst)
    }
  }, [tickets])

  const navigate = useNavigate()

  const columns = [
    {
      title: 'Ticket NO.',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      sorter: (a, b) => (a?.ticketNumber < b?.ticketNumber ? -1 : 1),
    },
    {
      title: 'Subject',
      dataIndex: 'ticketTitle',
      key: 'ticketTitle',
      sorter: (a, b) => (a?.ticketTitle < b?.ticketTitle ? -1 : 1),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastModifiedOn',
      key: 'lastModifiedOn',
      sorter: (a, b) => (a?.lastModifiedOn < b?.lastModifiedOn ? -1 : 1),
      render: (lastModifiedOn) =>
        moment(lastModifiedOn).format('MM/DD/YYYY hh:mm:ss a'),
    },
    {
      title: 'Status',
      dataIndex: 'ticketStatus',
      key: 'ticketStatus',
      sorter: (a, b) => (a?.ticketStatus < b?.ticketStatus ? -1 : 1),
      render: (status) => {
        // 0: active, 1: waiting, 2: closed, 3: closed and locked
        if (status === 0) {
          return (
            <span className="py-[4px] px-[8px] rounded uppercase bg-[#1C3238] text-[#0BB783]">
              Waiting for Admin
            </span>
          )
        }

        if (status === 1) {
          return (
            <span className="py-[4px] px-[8px] rounded uppercase bg-[#392F28] text-[#FFA800]">
              Waiting for You
            </span>
          )
        }

        if (status === 2) {
          return (
            <span className="py-[4px] px-[8px] rounded uppercase bg-[#3A2434] text-[#F64E60]">
              Closed
            </span>
          )
        }

        if (status === 3) {
          return (
            <span className="py-[4px] px-[8px] rounded uppercase bg-[#3A2434] text-[#F64E60]">
              Closed and Locked
            </span>
          )
        }
      },
    },
  ]
  const dispatch = useDispatch()

  const [visible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [popup] = useState(null)

  useEffect(() => {
    ;(async () => {
      await dispatch(getLoggedInUserAssignTickets())
      await dispatch(getUsers())
      await dispatch(getClients())
    })()
  }, [dispatch, deptId])

  useEffect(() => {
    ;(async () => {
      await dispatch(getUsers())
      await dispatch(getClients())
    })()
  }, [])

  const [values, setValues] = useState({
    ...AdvancedSearchOptions?.searchValues,
  })
  const [searchResults, setSearchResults] = useState('')

  useEffect(() => {
    if (!isSearch && data?.length) {
      navigate(`/client/dashboard/support/tickets/details/${data[0]?.id}`)
    } else if (!isSearch && data?.length < 1) {
      navigate(`/client/dashboard/support/tickets/list`)
    }
  }, [data])

  //Advanced Search
  const inputChangeHandler = (e) => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const searchTicketHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const defaultData = {
      advancedSearch: {
        fields: ['clientId'],
        keyword: user?.id ? user?.id : null,
      },
      pageNumber: 0,
      keyword: values?.title ? values?.title : null,
      pageSize: values?.numResult ? parseInt(values?.numResult) : 3,
      orderBy: ['ticketPriority'],
      ticketStatus: values?.status ? parseInt(values?.status) : null,
      ticketNumber: values?.ticketNo ? values?.ticketNo : null,
      ticketPriority: values.priority ? parseInt(values.priority) : null,
      clientEmail: values?.email ? values?.email : null,
      clientId: values?.client ? values?.client : null,
      startDate: values?.dateAdded?.start ? values?.dateAdded?.start : null,
      endDate: values?.dateAdded?.end ? values?.dateAdded?.end : null,
      departmentId: values?.department ? values?.department : null,
      assignedTo: userId,
    }

    const { url, config } = getTicketsConfig()

    const res = await axios.post(url, defaultData, config)

    setIsLoading(false)
    if (res?.status === 200) {
      setSearchResults(res?.data?.data?.length)
      setData(res?.data?.data)
    }
  }

  const onSearchHandler = async (data) => {
    setSearchData(data)
  }

  useEffect(() => {
    const fetchAsync = async () => {
      const defaultData = {
        pageNumber: 1,
        keyword: searchData,
        advancedSearch: {
          fields: ['clientId'],
          keyword: user?.id ? user?.id : null,
        },
        assignedTo: userId,
      }

      const { url, config } = getTicketsConfig()

      const res = await axios.post(url, defaultData, config)
      if (res?.status === 200) {
        setSearchResults(res?.data?.data?.length)
        setData(res?.data?.data)
      }
    }

    fetchAsync()
  }, [])

  return (
    <>
      <div className={`p-[40px] bg-[#1E1E2D] rounded-[8px] mt-2`}>
        {searchResults !== '' && (
          <div className="text-[#fff] text-md font-medium text-right">
            {searchResults === 0
              ? 'No tickets found for your search queries'
              : `
          Total tickets matching search queries found : ${searchResults}`}
          </div>
        )}

        {isSearch && (
          <TicketSearch
            AdvancedSearchOptions={AdvancedSearchOptions}
            values={values}
            setValues={setValues}
            OnChange={inputChangeHandler}
            onSubmit={searchTicketHandler}
            isLoading={isLoading}
          />
        )}
      </div>

      <div className={`p-[40px] bg-[#1E1E2D] rounded-[8px] mt-2`}>
        <div>
          <Table
            columns={columns}
            loading={loading}
            data={data}
            fieldToFilter="id"
            permissions={permissionsData}
            onSearchHandler={onSearchHandler}
            searchValue={searchData}
            searchText="Search"
            additionalBtns={[
              {
                text: 'Start Ticket',
                onClick: () => {
                  navigate('/client/dashboard/support/tickets/generate-ticket')
                },
              },
            ]}
            editAction={(record) => (
              <>
                <Button
                  onClick={() => navigate(currentRoute({ id: record?.id }))}
                >
                  View Details
                </Button>
              </>
            )}
            onRow={(record) => {
              return {
                onClick: () => {
                  navigate(currentRoute({ id: record?.id }))
                },
              }
            }}
          />
          <TicketMenu {...popup} visible={visible} />
        </div>
      </div>
    </>
  )
}
