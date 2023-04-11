import { useEffect, useState } from "react";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const LineItem = ({ item }) => {
  
  return (
    <div className="border-b-[1px] border-b-[#323248] border-dashed pb-[16px] pt-[5px] flex items-center justify-between">
      <div className="flex gap-[16px]">
        <div>
          <div className="text-white text-[14px] font-normal">
            <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#F64E60] mr-[5px]"></span>
            {item?.lineItem}{" "}
            {/* <NavLink
              className="text-[#3699FF]   inline-block"
            >
              <div style={{ padding: '10px'}}>{("ViewProduct")}</div>
            </NavLink> */}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[12px]">
        <div className="text-white text-[14px] font-normal">
          ${item?.price}
        </div>
      </div>

    </div>
  );
};

export const LineItems = () => {
  const [total, setTotal] = useState(0);
  const { order } = useSelector((state) => state?.orders);
  const { values } = useFormikContext();

  useEffect(() => {
    let sum = 0;
    values?.productLineItems?.length > 0 &&
      values?.productLineItems?.forEach((item) => {
        sum += item?.price;
      });
    setTotal(sum);
  }, [values?.productLineItems]);

  return (
    <>
      <div className="bg-[#1E1E2D]  rounded-[8px] mt-[20px]">
        <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
        <div className="flex items-center justify-between">
          <h6 className="text-[#474761] text-[12px] mt-[20px] uppercase">
            {(" PRODUCT")}
          </h6>
          <h6 className="text-[#474761] text-[12px] mt-[20px] uppercase">
            {("AMOUNT")}
          </h6>
        </div>

        {values?.productLineItems?.length > 0 &&
          values?.productLineItems?.map((item, idx) => {
            if (!item?.isDeleted) {
              return <LineItem key={`item-${idx}`} item={item} />;
            } else {
              return null;
            }
          })}
        <div className="flex items-center justify-between pt-[30px] mt-[20px]">
          <h6 className="text-[#fff] text-[14px] pt-[16px]">
            <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
            Sub Total
          </h6>
          <h6 className="text-[#fff] text-[14px]">${order?.subTotal || 'N/A'}</h6>
        </div>
        <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
        <div className="flex items-center justify-between">
          <h6 className="text-[#fff] text-[14px] pt-[16px]">
            <span className="w-[10px] h-[10px] inline-block rounded-[50%] border-2 border-[#323248] mr-[5px]"></span>
            Tax
          </h6>
          <h6 className="text-[#fff] text-[14px]">${order?.vat || '0.0'}</h6>
        </div>
        <div className="border-dashed border-t-[1px] h-[0px] border-[#323248] mt-[20px] mb-[20px]"></div>
        <div className="mt-[32px] rounded-[8px] border-[#3699FF] border-[1px] border-dashed bg-[#212E48] flex items-center justify-between p-[20px]">
          <div className="text-white text-[16px] font-medium">
            Total - ${order?.totalPrice}
          </div>
          <div className="text-[#3699FF] text-[14px]">
            {values?.paymentType === 0 ? "One Time Payment" : "Payment"}
          </div>
        </div>

        <div className="mt-[32px] border-dashed items-center">
          <h4 className="text-white text-[14px] mb-[16px]">Order Notes</h4>
          <p className="w-full min-h-[52px] rounded-[8px] bg-[#323248] p-[16px] text-white">
            {values.notes || "N/A"}
          </p>
        </div>
      </div>
    </>
  );
};
