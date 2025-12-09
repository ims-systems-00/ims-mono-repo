import classNames from "classnames";
import FormatedContents from "@/components/Editors/TextEditor/FormattedContents";
import { linkGenerator } from "@/utils/formatLinkGenerator";
const DetailsWrapper = ({ label, value, labelClass }) => {
  return (
    <>
      <div className="d-flex">
        <span
          className={classNames("font-weight-bold", {
            [`${labelClass}`]: labelClass,
          })}
        >
          {label}
        </span>
      </div>
      {value && (
        <FormatedContents mediaLinkGeneratorFn={linkGenerator} value={value} />
      )}
    </>
  );
};

export default DetailsWrapper;
