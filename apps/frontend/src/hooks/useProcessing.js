import { Spinner } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";
const useDataProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const btnProcessing = () => <Spinner size="sm" />;
  const textProcessing = (text) => (
    <>
      <span>
        {text} <Spinner size="sm" />
      </span>{" "}
    </>
  );
  return {
    processing,
    setProcessing,
    btnProcessing,
    textProcessing,
  };
};
export default useDataProcessing;
