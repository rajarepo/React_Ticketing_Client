import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { runHooks } from "store/Actions/products";
import { Button } from "components";
import { useParams } from "react-router-dom";

export const ModuleActions = () => {
  const dispatch = useDispatch();
  const { running, result } = useSelector((state) => state.products);
  const [Action, setAction] = useState(null);
  const [time, setTime] = useState((new Date()).toUTCString());
    const { id } = useParams();
  const run = (value) => {
    const data = {
        productId : id,
        hookType : value * 1,
    }
    const act = btns.find((btn) => btn.value === value);
    setAction(act.label);
    const t = (new Date()).toUTCString();
    setTime(t);
    dispatch(runHooks({data}));
  };
  const btns = [
    {
        label: "Create",
        value: 0,
    },
    {
        label: "Terminate",
        value: 3,
    },
    {
        label: "Suspend",
        value: 2,
    },
    {
        label: "Renew",
        value: 5,
    },
  ];
  return (
    <div>
        <div>
            <h3 className="text-white text-[30px] mt-[20px] mb-[10px] font-semibold">Module Actions</h3>
        </div>
    <div className="grid grid-cols-2 gap-[32px]" style={
        {
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
        }
    }>
        {btns.map((btn) => (
            <Button
                key={btn.value}
                onClick={() => run(btn.value)}
                loading={running}
                disabled={running}
            >
                {btn.label}
            </Button>
        ))}
    </div>
    <div>
    <h3 className="text-white text-[20px] font-medium mt-[20px] mb-[10px]">Recent Results</h3>
            <div className="text-white text-[15px]">
                {Action && (<div>{time} {" : "} {Action} {" Action Initiated"}
                <div>
                    {"============================="}
                </div>
                </div>
                )}
            </div>
                {result && (<pre className="text-white text-[15px]">
                {JSON.stringify(result, null, 2)}
                <div>
                    {"============================="}
                </div>
                <div>{(new Date()).toUTCString()} : {Action} {"Action Completed"}</div>
                </pre>)}
    </div>
    </div>
  );
}