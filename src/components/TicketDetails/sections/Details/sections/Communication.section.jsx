import { useParams } from 'react-router-dom'
import { Reply as ReplyIcon } from 'icons'
import { Formik, Form, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { List, Button, Popconfirm } from 'antd'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { getTicketById, addTicketReplies, addTicketRepliesOnReply } from 'store'
import { Button as CustomButton, Input } from 'components'
import { genrateFirstLetterName, getTimeDiff } from 'lib'
import { deleteComment } from 'store'
import { setTicketCommentLoading } from 'store'
import { getCurrentOnlineUsers } from 'store'
import moment from 'moment'
import { deleteTicketReplies } from 'store'
import { addTicketComments } from 'store'

const initialValues = {
  commentText: '',
}

const initialRepliesValues = {
  commentText: '',
}

const validationSchemaReplies = Yup.object().shape({
  commentText: Yup.string().required('Comment text is required'),
})

export const Communication = () => {
  const [selected, setSelected] = useState([])
  const user = useSelector((state) => state.auth.user)
  const { commentLoading } = useSelector((state) => state?.ticketComments)
  const { repliesLoading } = useSelector((state) => state?.ticketReplies)
  const isSelected = (id) => selected.indexOf(id) !== -1
  const { id } = useParams()
  const dispatch = useDispatch()
  const { ticket } = useSelector((state) => state?.tickets)

  useEffect(() => {
    dispatch(getCurrentOnlineUsers())
  }, [])

  const commentSource = ticket?.ticketComments
    ?.filter(
      (comment) =>
        !comment?.isDraft &&
        (comment?.ticketCommentType === 2 || comment?.ticketCommentType === 0)
    )
    ?.sort((a, b) => moment(a.createdOn) - moment(b.createdOn))

  // Ticket Data
  const ticketData = [
    { title: 'Ticket Number', value: ticket?.ticketNumber },
    {
      title: 'Opened By',
      value: ticket?.createdByName,
    },
    { title: 'Product / Service', value: ticket?.product },
    { title: 'Department', value: ticket?.department?.name },
  ]

  const handleReplyInput = (id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  return (
    <>
      <div className="mt-[40px] mb-[40px] grid grid-cols-[1fr_1fr] gap-3 w-full">
        {ticketData?.map((data) => {
          return (
            <div
              key={data?.title}
              className="flex items-center gap-[12px] justify-between border-[#323248] border-2 rounded border-dashed px-[20px] py-[16px]"
            >
              <p className="text-[16px] text-[#474761] whitespace-nowrap">
                {data?.title}
              </p>
              <p className={'text-[14px]'}>
                {data?.value ? data?.value : 'N/A'}
              </p>
            </div>
          )
        })}
      </div>

      <div className={`form ticket-form`}>
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={async (values) => {
            await dispatch(
              addTicketComments({
                ticketId: id,
                commentText: values?.commentText,
                ticketCommentType: 2,
              })
            )

            await dispatch(getTicketById(id, true))
          }}
        >
          {({ values, errors, touched }) => (
            <Form>
              <div
                className={`mb-[32px] items-end ${
                  ticket?.ticketStatus === 3 || ticket?.assignedTo === ''
                    ? 'pointer-events-none opacity-30'
                    : ''
                }`}
              >
                <Input
                  key="commentText"
                  name="commentText"
                  label=""
                  placeholder="Enter Message..."
                  type="textarea"
                  rows={7}
                />
                <div className="flex items-center gap-[12px] border-t-2 border-dashed border-[#323248] bg-[#171723] rounded-b-lg">
                  <CustomButton
                    loading={commentLoading}
                    htmlType="submit"
                    className="m-3 px-3 bg-[#3699FF] hover:bg-[#1989f8] rounded w-fit"
                  >
                    Send Message
                  </CustomButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Description */}
      <div
        id={ticket?.id}
        className={`${
          ticket?.clientFullName ? 'border-[#FFA800]/50' : 'border-[#8950FC]/70'
        } p-[20px] border-[1px] rounded-[8px]`}
      >
        <div className="w-full relative flex gap-3">
          <div className="image w-[55px] h-full rounded-[5px] overflow-hidden">
            {ticket?.clientFullName ? (
              ticket?.userImagePath ? (
                <img
                  src={ticket?.userImagePath}
                  alt={ticket?.clientFullName}
                  className="w-[47px] h-[47px]"
                />
              ) : (
                <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                  {genrateFirstLetterName(ticket?.clientFullName)}
                </div>
              )
            ) : (
              <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                {genrateFirstLetterName('A')}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full gap-[2px]">
            <div className="flex justify-between w-full items-center">
              <div className="flex align-center items-center">
                <p className="text-[#fff] text-[16px] h-fit">
                  {ticket?.clientFullName || 'Admin'}
                </p>
                <span
                  className={`${
                    ticket?.clientFullName
                      ? 'bg-[#392F28] text-[#FFA800]'
                      : 'bg-[#2F264F] text-[#8950FC]'
                  } py-1 px-2 rounded text-xs ml-2 flex items-center justify-center`}
                >
                  {ticket?.clientFullName ? 'CLIENT' : 'ADMIN'}
                </span>
              </div>

              <div className="flex items-center gap-[12px] text-[16px]"></div>
            </div>
            <p className="text-[14px] text-[#474761] rounded-sm">
              {getTimeDiff(ticket?.createdOn)} ago
            </p>
          </div>
        </div>
        <div className="text-[16px] text-[#92928F] mt-[20px] leading-7">
          <div dangerouslySetInnerHTML={{ __html: ticket?.description }}></div>
        </div>
      </div>

      {/* Comments */}
      <div className={'ticket-list-wrap custom-table__table mt-4'}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50', '100', '200'],
          }}
          dataSource={commentSource}
          footer={''}
          renderItem={(comment) => (
            <List.Item key={comment?.id} actions={''} extra={''}>
              <div
                id={comment?.id}
                className={`${
                  comment?.userFullName
                    ? 'border-[#FFA800]/50'
                    : 'border-[#8950FC]/70'
                } p-[20px] border-[1px] rounded-[8px]`}
              >
                <div className="w-full relative flex gap-3">
                  <div className="image w-[55px] h-full rounded-[5px] overflow-hidden">
                    {comment?.userFullName ? (
                      comment?.userImagePath ? (
                        <img
                          src={comment?.userImagePath}
                          alt={comment?.userFullName}
                          className="w-[47px] h-[47px]"
                        />
                      ) : (
                        <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                          {genrateFirstLetterName(comment?.userFullName)}
                        </div>
                      )
                    ) : (
                      <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                        {genrateFirstLetterName('A')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col w-full gap-[2px]">
                    <div className="flex justify-between w-full items-center">
                      <div className="flex align-center items-center">
                        <p className="text-[#fff] text-[16px] h-fit">
                          {comment?.userFullName || 'Admin'}
                        </p>
                        <span
                          className={`${
                            comment?.userFullName
                              ? 'bg-[#392F28] text-[#FFA800]'
                              : 'bg-[#2F264F] text-[#8950FC]'
                          } py-1 px-2 rounded text-xs ml-2 flex items-center justify-center`}
                        >
                          {comment?.userFullName ? 'CLIENT' : 'ADMIN'}
                        </span>
                      </div>

                      {ticket?.ticketStatus !== 3 && (
                        <div className="flex items-center gap-[12px] text-[16px]">
                          {comment?.ticketCommentType !== 1 && (
                            <span
                              onClick={() => handleReplyInput(comment?.id)}
                              className={`text-[#474761] cursor-pointer hover:text-[#40a9ff] ${
                                selected?.includes(comment?.id)
                                  ? 'text-[#40a9ff]'
                                  : ''
                              }`}
                            >
                              Reply
                            </span>
                          )}
                          {comment?.createdBy === user?.id ? (
                            <Popconfirm
                              okButtonProps={{
                                className: 'bg-[#40a9ff]',
                              }}
                              title="Are you sure you want to delete this comment?"
                              onConfirm={async () => {
                                await dispatch(
                                  deleteComment({ id: comment?.id })
                                )
                                dispatch(setTicketCommentLoading(true))
                                await dispatch(getTicketById(ticket?.id, true))
                                dispatch(setTicketCommentLoading(false))
                              }}
                            >
                              <div
                                className={
                                  'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                                }
                              >
                                Delete
                              </div>
                            </Popconfirm>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <p className="text-[14px] text-[#474761] rounded-sm">
                      {getTimeDiff(comment?.createdOn)} ago
                    </p>
                  </div>
                </div>
                <div className="text-[16px] text-[#92928F] mt-[20px] leading-7">
                  {comment?.commentText}
                </div>
                {isSelected(comment.id) && (
                  <div className={'reply-box mt-[20px] relative'}>
                    <Formik
                      initialValues={initialRepliesValues}
                      validationSchema={validationSchemaReplies}
                      enableReinitialize
                      onSubmit={async (values) => {
                        const newValues = {
                          commentText: values?.commentText,
                          TicketCommentId: comment?.id,
                        }
                        ;(async () => {
                          await dispatch(addTicketReplies(newValues))
                          await dispatch(getTicketById(id))
                          setSelected([])
                        })()
                      }}
                    >
                      {({ errors, touched }) => {
                        return (
                          <Form>
                            <div
                              className={`relative  ${
                                ticket?.ticketStatus === 3 ||
                                ticket?.assignedTo === ''
                                  ? 'pointer-events-none opacity-30'
                                  : ''
                              }`}
                            >
                              <Field
                                className="modal__form-el-field"
                                key="commentText"
                                type="text"
                                name="commentText"
                                placeholder="Write Something"
                              />
                              <Button
                                htmlType="submit"
                                loading={repliesLoading}
                                className="absolute bottom-5 right-4 py-[0px] px-[0px] bg-none bg-transparent border-none"
                              >
                                <ReplyIcon />
                              </Button>
                            </div>
                            {touched['commentText'] &&
                              errors['commentText'] && (
                                <div className="error mt-[8px]">
                                  {errors['commentText']}
                                </div>
                              )}
                          </Form>
                        )
                      }}
                    </Formik>
                  </div>
                )}
              </div>

              {/* Reply */}
              <div className="ml-[40px]">
                {comment?.ticketCommentReplies
                  ?.slice()
                  ?.sort((a, b) => moment(a.createdOn) - moment(b.createdOn))
                  ?.map((reply, i) =>
                    !reply.ticketCommentParentReplyId ? (
                      <div>
                        {/* Reply on Comment */}
                        <div
                          key={i}
                          id={reply?.id}
                          className={`${
                            reply?.userFullName
                              ? 'border-[#FFA800]/70'
                              : 'border-[#8950FC]/70'
                          } p-[20px] border-[1px] rounded-[8px] mt-[20px]`}
                        >
                          <div className="w-full relative flex gap-3">
                            <div className="image w-[55px] h-full rounded-[5px] overflow-hidden">
                              {reply?.userFullName ? (
                                reply?.userImagePath ? (
                                  <img
                                    src={reply?.userImagePath}
                                    alt={reply?.userFullName}
                                    className="w-[47px] h-[47px]"
                                  />
                                ) : (
                                  <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                                    {genrateFirstLetterName(
                                      reply?.userFullName
                                    )}
                                  </div>
                                )
                              ) : (
                                <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                                  {genrateFirstLetterName('A')}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col w-full gap-[2px]">
                              <div className="flex justify-between w-full items-center">
                                <div className="flex align-center items-center">
                                  <p className="text-[#fff] text-[16px] h-fit">
                                    {reply?.userFullName || 'Admin'}
                                  </p>
                                  <span
                                    className={`${
                                      reply?.userFullName
                                        ? 'bg-[#392F28] text-[#FFA800]'
                                        : 'bg-[#2F264F] text-[#8950FC]'
                                    } py-1 px-2 rounded text-xs ml-2 flex items-center justify-center`}
                                  >
                                    {reply?.userFullName ? 'CLIENT' : 'ADMIN'}
                                  </span>
                                </div>

                                {ticket?.ticketStatus !== 3 && (
                                  <div className="flex items-center gap-[12px] text-[16px]">
                                    {reply?.ticketCommentType !== 1 && (
                                      <span
                                        onClick={() =>
                                          handleReplyInput(reply.id)
                                        }
                                        className={`text-[#474761] cursor-pointer hover:text-[#40a9ff] ${
                                          selected?.includes(reply?.id)
                                            ? 'text-[#40a9ff]'
                                            : ''
                                        }`}
                                      >
                                        Reply
                                      </span>
                                    )}
                                    {reply?.createdBy === user?.id ? (
                                      <Popconfirm
                                        okButtonProps={{
                                          className: 'bg-[#40a9ff]',
                                        }}
                                        title="Are you sure you want to delete this reply?"
                                        onConfirm={async () => {
                                          await dispatch(
                                            deleteTicketReplies(reply?.id)
                                          )
                                          dispatch(
                                            setTicketCommentLoading(true)
                                          )
                                          await dispatch(
                                            getTicketById(ticket?.id, true)
                                          )
                                          dispatch(
                                            setTicketCommentLoading(false)
                                          )
                                        }}
                                      >
                                        <span
                                          className={
                                            'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                                          }
                                        >
                                          Delete
                                        </span>
                                      </Popconfirm>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                )}
                              </div>
                              <p className="text-[14px] text-[#474761] rounded-sm">
                                {getTimeDiff(reply?.createdOn)} ago
                              </p>
                            </div>
                          </div>

                          <div className="text-[16px] text-[#92928F] mt-[20px] leading-7">
                            {reply?.commentText}
                          </div>
                          {isSelected(reply.id) && (
                            <div className={'reply-box mt-[20px] relative'}>
                              <Formik
                                initialValues={initialRepliesValues}
                                validationSchema={validationSchemaReplies}
                                enableReinitialize
                                onSubmit={async (values) => {
                                  const newValues = {
                                    commentText: values?.commentText,
                                    ticketCommentId: comment?.id,
                                    ticketCommentParentReplyId: reply?.id,
                                  }
                                  ;(async () => {
                                    await dispatch(
                                      addTicketRepliesOnReply(newValues)
                                    )
                                    await dispatch(getTicketById(id))
                                    setSelected([])
                                  })()
                                }}
                              >
                                {({ errors, touched, values }) => {
                                  return (
                                    <Form>
                                      <div
                                        className={`relative  ${
                                          ticket?.ticketStatus === 3 ||
                                          ticket?.assignedTo === ''
                                            ? 'pointer-events-none opacity-30'
                                            : ''
                                        }`}
                                      >
                                        <Field
                                          className="modal__form-el-field"
                                          key="commentText"
                                          type="text"
                                          name="commentText"
                                          placeholder="Write Something"
                                        />
                                        <Button
                                          htmlType="submit"
                                          loading={repliesLoading}
                                          className="absolute bottom-5 right-4 py-[0px] px-[0px] bg-none bg-transparent border-none"
                                        >
                                          <ReplyIcon />
                                        </Button>
                                      </div>
                                      {touched['commentText'] &&
                                        errors['commentText'] && (
                                          <div className="error mt-[8px]">
                                            {errors['commentText']}
                                          </div>
                                        )}
                                    </Form>
                                  )
                                }}
                              </Formik>
                            </div>
                          )}
                        </div>

                        {/* Replies on Reply */}
                        {comment.ticketCommentReplies
                          .filter(
                            (repliesOnReply) =>
                              repliesOnReply.ticketCommentParentReplyId ===
                              reply.id
                          )
                          ?.slice()
                          ?.sort(
                            (a, b) => moment(a.createdOn) - moment(b.createdOn)
                          )
                          ?.map((repliesOnReplyData, i) => (
                            <div
                              key={i}
                              id={repliesOnReplyData?.id}
                              className={`${
                                repliesOnReplyData?.userFullName
                                  ? 'border-[#FFA800]/70'
                                  : 'border-[#8950FC]/70'
                              } p-[20px] border-[1px] rounded-[8px] mt-[20px] ml-[40px]`}
                            >
                              <div className="w-full relative flex gap-3">
                                <div className="image w-[55px] h-full rounded-[5px] overflow-hidden">
                                  {repliesOnReplyData?.userFullName ? (
                                    repliesOnReplyData?.userImagePath ? (
                                      <img
                                        src={repliesOnReplyData?.userImagePath}
                                        alt={repliesOnReplyData?.userFullName}
                                        className="w-[47px] h-[47px]"
                                      />
                                    ) : (
                                      <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                                        {genrateFirstLetterName(
                                          repliesOnReplyData?.userFullName
                                        )}
                                      </div>
                                    )
                                  ) : (
                                    <div className="bg-[#171723] text-[#0BB783] px-[8px] py-[4px] uppercase w-[47px] h-[47px] rounded-[4px] flex justify-center items-center">
                                      {genrateFirstLetterName('A')}
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col w-full gap-[2px]">
                                  <div className="flex justify-between w-full items-center">
                                    <div className="flex align-center items-center">
                                      <p className="text-[#fff] text-[16px] h-fit">
                                        {repliesOnReplyData?.userFullName ||
                                          'Admin'}
                                      </p>
                                      <span
                                        className={`${
                                          repliesOnReplyData?.userFullName
                                            ? 'bg-[#392F28] text-[#FFA800]'
                                            : 'bg-[#2F264F] text-[#8950FC]'
                                        } py-1 px-2 rounded text-xs ml-2 flex items-center justify-center`}
                                      >
                                        {repliesOnReplyData?.userFullName
                                          ? 'CLIENT'
                                          : 'ADMIN'}
                                      </span>
                                    </div>

                                    {ticket?.ticketStatus !== 3 && (
                                      <div className="flex items-center gap-[12px] text-[16px]">
                                        {repliesOnReplyData?.createdBy ===
                                        user?.id ? (
                                          <Popconfirm
                                            okButtonProps={{
                                              className: 'bg-[#40a9ff]',
                                            }}
                                            title="Are you sure you want to delete this reply?"
                                            onConfirm={async () => {
                                              await dispatch(
                                                deleteTicketReplies(
                                                  repliesOnReplyData?.id
                                                )
                                              )
                                              dispatch(
                                                setTicketCommentLoading(true)
                                              )
                                              await dispatch(
                                                getTicketById(ticket?.id, true)
                                              )
                                              dispatch(
                                                setTicketCommentLoading(false)
                                              )
                                            }}
                                          >
                                            <span
                                              className={
                                                'text-[#474761] cursor-pointer hover:text-[#F64E60]'
                                              }
                                            >
                                              Delete
                                            </span>
                                          </Popconfirm>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[14px] text-[#474761] rounded-sm">
                                    {getTimeDiff(repliesOnReplyData?.createdOn)}{' '}
                                    ago
                                  </p>
                                </div>
                              </div>

                              <div className="text-[16px] text-[#92928F] mt-[20px] leading-7">
                                {repliesOnReplyData?.commentText}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : null
                  )}
              </div>
            </List.Item>
          )}
        />
      </div>
    </>
  )
}
