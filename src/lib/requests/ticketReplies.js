import { getConfig } from "lib";
const ticketCommentRepliesConfig = (action) =>
  getConfig({ module: "Tickets", action });

const prefix = `/api/ticketcommentreplies`;

export const addTicketRepliesConfig = () => ({
  url: `${prefix}/createclientcommentreply`,
  config: ticketCommentRepliesConfig('View'),
});

export const addTicketRepliesOnReplyConfig = () => ({
  url: `${prefix}/createclientcommentreply`,
  config: ticketCommentRepliesConfig('View'),
});

export const deleteTicketRepliesConfig = (id) => ({
  url: `${prefix}/deleteclientcommentreply/${id}`,
  config: ticketCommentRepliesConfig('View'),
});
