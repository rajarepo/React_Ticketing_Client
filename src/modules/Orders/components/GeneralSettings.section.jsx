import { Input } from "components";
import { Link } from "react-router-dom";
import { LineItems } from "./LineItems.section";

export const GeneralSettings = ({ isView, ...props }) => {
  return (
    <div className="bg-[#1E1E2D] p-[32px] rounded-[8px]">
      <div className="flex items-center justify-between mb-[16px]">
        <h6 className="text-white font-medium text-[20px]">
          Products / Services
        </h6>
        {props?.actionLink ? (
          <div className="flex justify-end gap-3">
            {props?.actionLink.map((action) => (
              <Link
                to={action?.link}
                className="text-[#3699FF] text-[16px] hover:text-[#0BB783]"
              >
                {action?.text}
              </Link>
            ))}
          </div>
        ) : null}

      </div>
      <LineItems /> 
    </div>
  );
};
