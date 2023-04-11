import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { Form, Formik } from 'formik'
import moment from 'moment'

import { getOrderDetails, editOrder, getUsersByDepartmentID } from 'store'
import { GeneralSettings } from '../components/GeneralSettings.section'
import { LineItems } from '../components/LineItems.section'
import { OrderSidebar } from '../components/OrderSidebar.section'
import { getOrderByID } from 'store'

export const OrderDetail = () => {
  const dispatch = useDispatch()
  const { product } = useSelector((state) => state?.products)
  const { loading, order } = useSelector((state) => state?.orders)
  const { settings } = useSelector((state) => state.appSettings)
  const { id } = useParams()

  useEffect(() => {
    ;(async () => {
      await dispatch(getOrderByID(id))
    })()
  }, [dispatch])

  useEffect(() => {
    if (order && order?.products[0]?.productDepartments) {
      order?.products[0]?.productDepartments?.forEach((dept) => {
        dispatch(getUsersByDepartmentID(dept?.departmentId))
      })
    }
  }, [order])

  const initVal = {
    preview: product?.base64Image,
    thumbnail: product?.thumbnail,
    status: order?.status,
    orderNo: `#${order?.orderNo}`,
    orderPrice: order?.totalPrice,
    adminAssigned: order?.adminAssigned,
    name: order?.products[0]?.name,
    description: order?.products[0]?.description,
    productLineItems: order?.orderProductLineItems?.map((item) => ({
      ...item,
      isDeleted: item?.isDeleted || false,
    })),
    assignedToClientId: order?.clientFullName,
    createdOn: moment(order?.createdOn).format('MMMM Do, YYYY'),
    modifiedOn: moment(order?.lastModifiedOn).format('MMMM Do, YYYY'),
    clientFullName: order?.clientFullName,
    notes: order?.notes,
  }
  return (
    <div className="p-[40px]">
      <Formik
        initialValues={initVal}
        enableReinitialize
        onSubmit={async (values) => {
          const newValues = {
            status: Number(values?.status),
            adminAssignedId: values?.adminAssigned,
          }
          await dispatch(editOrder(id, newValues))
        }}
      >
        {() => {
          return (
            <Form>
              <div className="users">
                <div className="admin-details min-w-[60vh]">
                  {loading ? (
                    <Spin
                      size="large"
                      style={{ gridColumn: '1/3', alignSelf: 'center' }}
                    />
                  ) : (
                    <>
                      <div className="admin-details__left">
                        <OrderSidebar />
                      </div>
                      <div className="admin-details__right">
                        <GeneralSettings
                          actionLink={[
                            {
                              link: order?.bill?.id
                                ? `/client/dashboard/billing/detail/${order?.bill?.id}`
                                : '#',
                              text: 'View Invoice',
                            },
                          ]}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
