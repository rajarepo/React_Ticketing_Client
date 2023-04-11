import { getConfig } from "lib";

const ordersConfig = (action) => getConfig({ module: "SubUsers", action });
// const { id } = JSON.parse(localStorage.getItem('CurrentUser__client'))


const prefix = `/api/v1/client/orders`;
const otprefix = "/api/v1/client/ordertemplates";

export const getOrdersConfig = (id) => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [],
      keyword: "",
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 0,
    orderBy: [""],
    clientId: id
  },
  config: ordersConfig("View"),
});

export const getOrdersByClientConfig = ({ id }) => ({
  url: `${prefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: ["clientId"],
      keyword: id,
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 0,
    orderBy: [""],
  },
  config: ordersConfig("View"),
});

export const createOrderConfig = () => ({
  url: `${prefix}`,
  config: ordersConfig("Create"),
});

export const getOrderConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: ordersConfig("Create"),
});
export const getOrderByIdConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: ordersConfig("View"),
});

export const getOrderTemplatesConfig = () => ({
  url: `${otprefix}/search`,
  defaultData: {
    advancedSearch: {
      fields: [],
      keyword: "",
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 0,
    orderBy: [""],
  },
  config: ordersConfig("View"),
});

export const createOrderTemplateConfig = () => ({
  url: `${otprefix}`,
  config: ordersConfig("Create"),
});

export const editOrderTemplateConfig = ({ id }) => ({
  url: `${otprefix}/${id}`,
  config: ordersConfig("Update"),
});
