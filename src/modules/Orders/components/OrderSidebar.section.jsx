import { useDispatch } from "react-redux";
import { Input } from "components";
import { useSelector } from "react-redux";

export const OrderSidebar = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state?.orders);

  return (
    <div className="p-[32px] bg-[#1E1E2D] rounded-[8px]">
      <div className="flex items-center justify-between">
        <h6 className="text-white font-medium text-[16px]">Order Details</h6>
      </div>
      <p className="text-[#474761] text-[14x] mt-[8px] mb-[32px]">
        View corresponding product details
      </p>

      <Input
        name="clientFullName"
        placeholder="Client Name"
        type="text"
        label="Assigned To"
        className="mb-[20px] mt-1"
        disabled={true}
      />
      <Input
        name="status"
        placeholder="Status"
        type="select"
        label="Status"
        className="mb-[20px]"
        options={[
          { label: "Pending", value: 0 },
          { label: "Active", value: 1 },
          { label: "Cancelled", value: 2 },
          { label: "Suspended", value: 3 },
          { label: "Completed", value: 4 },
          { label: "Accepted", value: 5 },
          { label: "Draft", value: 6 },
        ]}
        disabled={true}
      />
      <Input
        name="orderNo"
        placeholder="#43"
        type="text"
        label="Order Number"
        className="mb-[20px] mt-1"
        disabled={true}
      />
      <Input
        name="orderPrice"
        type="text"
        label="Total Price"
        className="mb-[20px]"
        disabled
      />
      <Input
        name="createdOn"
        type="text"
        label="Created On"
        className="mb-[20px]"
        disabled
      />
      <Input
        name="modifiedOn"
        type="text"
        label="Last Modified On"
        className="mb-[20px]"
        disabled
      />
    </div>
  );
};
