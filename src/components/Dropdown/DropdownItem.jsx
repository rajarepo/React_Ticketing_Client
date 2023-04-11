/* eslint-disable no-undef */
import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { closeTicket } from 'store'

const DropdownItem = ({ label, id }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <Menu.Item>
      {label == 'View' ? (
        <button
          className={clsx(
            'block px-4 py-2 text-sm text-[#92928F] capitalize w-full text-left'
          )}
          onClick={() => {
            navigate(`support/tickets/details/${id}`)
          }}
        >
          {label}
        </button>
      ) : (
        <button
          className={clsx(
            'block px-4 py-2 text-sm text-[#92928F] capitalize w-full text-left'
          )}
          onClick={async () => {
            await dispatch(closeTicket(id))
          }}
        >
          {label}
        </button>
      )}
    </Menu.Item>
  )
}

export default DropdownItem
