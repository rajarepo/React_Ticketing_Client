import {
  getError,
  axios,
  getTicketCommentsConfig,
  addTicketCommentConfig,
  deleteTicketCommentConfig,
} from "lib";
import { toast } from "react-toastify";
import {
  getTicketCommentsDispatch,
  setTicketCommentLoading,
} from "store/Slices";
import { getTickets } from "./ticketsActions";

// Get All Admin Ticket Comments
export const getTicketComments = (params = []) => {
  return async (dispatch) => {
    dispatch(setTicketCommentLoading(true));
    try {
      const { url, defaultData, config } = getTicketCommentsConfig();

      if (params?.ticketId) {
        defaultData.advancedSearch.fields.push("ticketId");
        defaultData.advancedSearch.keyword = params?.ticketId;
      }
      const res = await axios.post(url, defaultData, config);
      dispatch(getTicketCommentsDispatch(res?.data?.data));
      dispatch(setTicketCommentLoading(false));
    } catch (e) {
      toast.error(getError(e));
      dispatch(setTicketCommentLoading(false));
    }
  };
};

// Add Comments
export const addTicketComments = (data) => {
  return async (dispatch) => {
    dispatch(setTicketCommentLoading(true));
    try {
      const { url, config } = addTicketCommentConfig();
      const res = await axios.post(url, data, config);
      if (res?.status === 200) {
        toast.success("Ticket Comments Added Successfully");
        dispatch(getTickets());
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setTicketCommentLoading(false));
    }
  };
};

// Update Comment
export const updateTicketComments = ({ data }) => {
  return async (dispatch) => {
    dispatch(setTicketCommentLoading(true));
    try {
      const res = await axios.put(`/api/ticketcomments/${data?.id}`, data, {
        modulename: "Users",
        moduleactionname: "Update",
      });
      if (res.status === 200) {
        toast.success("Ticket Comments Updated Successfully");
        dispatch(getTickets());
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setTicketCommentLoading(false));
    }
  };
};

// Delete Comment
export const deleteComment = ({ id }) => {
  return async (dispatch) => {
    dispatch(setTicketCommentLoading(true));
    try {
      const { url, config } = deleteTicketCommentConfig(id);
      const res = await axios.delete(url, config);
      if (res.status === 200) {
        toast.success("Ticket Comments Deleted Successfully");
        dispatch(getTickets());
      }
    } catch (e) {
      toast.error(getError(e));
    } finally {
      dispatch(setTicketCommentLoading(false));
    }
  };
};
