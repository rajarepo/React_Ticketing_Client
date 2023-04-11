import { getConfig } from 'lib'
const ticketsConfig = (action) => getConfig({ module: 'Tickets', action })
const prefix = `/api/tickets`


export const getTicketsConfig = () => ({

  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [''],
      keyword: '',
    },
    keyword: '',
    pageNumber: 1,
    pageSize: 5,
    // assignedTo: assignedTo,
    orderBy: ['ticketPriority'],
  },
  config: ticketsConfig('Search'),
})

export const getTicketConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: ticketsConfig('View'),
})
export const getTicketCloseConfig = (id) => ({
  url: `${prefix}/close/${id}`,
  config: ticketsConfig('View'),
})

export const createTicketConfig = () => ({
  url: `${prefix}/create`,
  config: ticketsConfig('Create'),
})

export const editTicketConfig = ({ id }) => ({
  url: `${prefix}/${id}`,
  // config: ticketsConfig('Update'),
})

export const getTicketsByClintIDConfig = ({ id }) => ({
  url: `${prefix}/getticketsbyclientid/${id}`,
  // config: ticketsConfig('View'),
})

export const getLoggedInUserAssignTicketsConfig = () => ({
  url: `${prefix}/getloggedinuserassigntickets`,
  config: ticketsConfig('View'),
})

export const getAssignedTicketsByIDConfig = ({ id }) => {
  return {
    url: `${prefix}/search`,
    defaultData: {
      advancedSearch: {
        fields: ['assignedTo'],
        keyword: id,
      },
      keyword: '',
      pageNumber: 1,
      pageSize: 5,
      orderBy: ['ticketPriority'],
    },
    config: ticketsConfig('Search'),
  }
}

export const getTicketHistoryByIDConfig = ({ id }) => ({
  url: `${prefix}/gettickethistory/${id}`,
  // config: ticketsConfig('View'),
})

export const getTicketsByDepartmentIdConfig = ({ id }) => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: ['departmentId'],
      keyword: id,
    },
    keyword: '',
    pageNumber: 0,
    pageSize: 100,
    orderBy: [''],
    // ticketStatus: 0,
    // ticketPriority: '0 = Urgent',
    // ticketRelatedTo: '0 = KnowledgeBase',
  },
  // config: ticketsConfig('View'),
})
