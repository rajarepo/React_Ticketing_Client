/* eslint-disable no-lone-blocks */
import { useTranslation } from 'react-i18next'
import { Spin } from 'antd'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getInvoiceByID } from 'store/Actions/invoiceActions'

// import "./InvoiceDetails.styles.scss";

export const BillDownload = () => {
  const { t } = useTranslation('/Bills/ns')
  const dispatch = useDispatch()
  const { id } = useParams()
  const brand = useSelector((state) => state?.brand?.brand)
  const { invoice, loading } = useSelector((state) => state?.invoice)
  useEffect(() => {
    ;(async () => {
      await dispatch(getInvoiceByID(id))
    })()
  }, [dispatch])

  return (
    <div className="text-center users p-[24px] md:p-[40px]">
      {loading || invoice === null ? (
        <Spin size="large" style={{ gridColumn: '1/3', alignSelf: 'center' }} />
      ) : (
        <div className="bg-[white] rounded-lg text-left">
          <div className="invoice-details">
            <div className="flex-wrap justify-between w-[100%]">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <h4 className="text-black text-[24px]">
                      {invoice?.billNo}
                    </h4>
                  </div>
                  <div className="mt-[40px]">
                    <h6 className="text-[#999999] text-[14px]">
                      {t('issueDate')}
                    </h6>
                    <p className="text-black  text-[14px] mt-[4px]">
                      {moment(invoice?.createdOn).format('MM-DD-YYYY HH:mm:ss')}
                    </p>
                  </div>
                  <div className="mt-[20px]">
                    <h6 className="text-[#999999] text-[14px]">
                      {t('dueDate')}
                    </h6>
                    <p className="text-black  text-[14px] mt-[4px]">
                      {moment(invoice?.dueDate).format('MM-DD-YYYY HH:mm:ss')}
                      {moment(invoice?.dueDate).isSame(new Date(), 'day')}{' '}
                      {moment(invoice?.dueDate).isSame(new Date(), 'day') ? (
                        <span className="text-[#F64E60] inline-block">
                          Due Today
                        </span>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                  <div className="mt-[20px]">
                    <h6 className="text-[#999999] text-[14px]">
                      {t('fullName')}
                    </h6>
                    <p className="text-black  text-[14px] mt-[4px]">
                      {invoice?.user?.fullName}
                    </p>
                  </div>
                  <div className="mt-[20px]">
                    <h6 className="text-[#999999] text-[14px]">
                      {t('phoneNumber')}
                    </h6>
                    <p className="text-black  text-[14px] mt-[4px]">
                      {invoice?.user?.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-right">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-end gap-2">
                      <h4 className="text-[#999999] text-[24px] flex items-center">
                        Bill to
                      </h4>
                      <div className="ml-[15px] mr-[10px] ">
                        <img
                          src="/icon/logo.svg"
                          alt="logo"
                          className="h-[50px]"
                        />
                      </div>
                      <div className="text-[black] text-[24px] ">
                        {brand.name}
                      </div>
                    </div>
                    <div
                      className="text-[#3699FF] p-[0] container"
                      style={{ float: 'right' }}
                    >
                      companyName
                    </div>
                  </div>
                  <div className="flex mt-[12px] ml-[30px] justify-start gap-4">
                    <div>
                      <h6 className="text-[#999999] text-[14px] text-start">
                        {t('address')}
                      </h6>
                      <p className="text-black text-start  ml-[5px]  text-[14px] mt-[4px]">
                        {invoice?.user?.address1}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-[40px] ml-[30px] justify-start gap-4">
                    <div>
                      <h6 className="text-[#999999] text-[14px] text-start">
                        {t('email')}
                      </h6>
                      <p className="text-black text-start ml-[5px] text-[14px] mt-[4px]">
                        {invoice?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-[40px]">
                {invoice?.products?.map((product, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#999999] text-[12px] uppercase">
                        {t(product?.name)}
                      </h6>
                      <h6 className="text-[#999999] text-[12px] uppercase">
                        {t('amount')}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                    {invoice?.orderProductLineItems?.map((data, i) => (
                      <div key={i}>
                        {product?.id == data?.productId && (
                          <div className="flex items-center justify-between">
                            <h6 className="text-black text-[14px]">
                              <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
                              {data?.lineItem}
                            </h6>
                            <h6 className="text-black text-[14px]">
                              ${data?.price}
                            </h6>
                          </div>
                        )}
                        <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                      </div>
                    ))}
                  </div>
                ))}
                {/* {invoice?.orderProductLineItems?.map((data, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                ))} */}
                <div className="flex items-center justify-between">
                  <h6 className="text-black text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t('subTotal')}
                  </h6>
                  <h6 className="text-black text-[14px]">
                    ${invoice?.subTotal}
                  </h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                <div className="flex items-center justify-between">
                  <h6 className="text-black text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t('vat')}
                  </h6>
                  <h6 className="text-black text-[14px]">${invoice?.vat}</h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                <div className="flex items-center justify-between">
                  <h6 className="text-black text-[14px]">
                    <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                    {t('Total')}
                  </h6>
                  <h6 className="text-black text-[14px]">
                    ${invoice?.totalPrice}
                  </h6>
                </div>
                <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              </div>
            </div>

            {/* <div className="mt-[40px]">
              <div className="flex items-center justify-between">
                <h6 className="text-[#999999] text-[12px] uppercase">
                  Sample Product 1
                </h6>
                <h6 className="text-[#999999] text-[12px] uppercase">
                  {t('amount')}
                </h6>
              </div>
              <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              {invoice?.orderProductLineItems?.map((data, i) => (
                <>
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#0BB783] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                </>
              ))}

              <div className="flex items-center justify-between">
                <h6 className="text-[#999999] text-[12px] uppercase">
                  Sample Product 2
                </h6>
                <h6 className="text-[#999999] text-[12px] uppercase">
                  {t('amount')}
                </h6>
              </div>
              <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              {invoice?.orderProductLineItems?.map((data, i) => (
                <>
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <h6 className="text-[#fff] text-[14px]">
                        <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#0BB783] mr-[5px]"></span>
                        {data?.lineItem}
                      </h6>
                      <h6 className="text-[#fff] text-[14px]">
                        ${data?.price}
                      </h6>
                    </div>
                    <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
                  </div>
                </>
              ))}

              <div className="flex items-center justify-between">
                <h6 className="text-[#fff] text-[14px]">
                  <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                  {t('subTotal')}
                </h6>
                <h6 className="text-[#fff] text-[14px]">
                  ${invoice?.subTotal}
                </h6>
              </div>
              <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              <div className="flex items-center justify-between">
                <h6 className="text-[#fff] text-[14px]">
                  <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                  {t('vat')}
                </h6>
                <h6 className="text-[#fff] text-[14px]">${invoice?.vat}</h6>
              </div>
              <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
              <div className="flex items-center justify-between">
                <h6 className="text-[#fff] text-[14px]">
                  <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
                  {t('Total')}
                </h6>
                <h6 className="text-[#fff] text-[14px]">
                  ${invoice?.totalPrice}
                </h6>
              </div>
              <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}
