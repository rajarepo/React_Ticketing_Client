import { useSelector } from "react-redux";

const OrderName = ({ order, isLoggedIn }) => {
  let orderName = "";
  if (isLoggedIn) {
    let orderN = order.fullName ? order.fullName.split(" ") : "NA";
    if (orderN.length < 2) {
        orderName = orderN[0].charAt(0);
    }else{
        orderName = orderN[0].charAt(0) + orderN[1].charAt(0);

    }
  }
  return orderName.toUpperCase();
};
export default OrderName;
