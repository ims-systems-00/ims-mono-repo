import emptyBox from "@/assets/img/empty-box.png";
import { Button, DrawerOpener } from "@ims-systems-00/ims-ui-kit";
import { useAnalyticalAssistant } from "./store";

const EmptyList = ({
  emptyListMessage = "Revolutionise your analysis and decision-making with Alice.",
}) => {
  const { clearAnalysis } = useAnalyticalAssistant();
  return (
    <div className="rounded-2 p-5 my-3 bg-light d-flex flex-column justify-content-center align-items-center">
      <img className="mx-auto" src={emptyBox} width={100} alt="" />
      <h4 className="my-3">Looks like this place is empty</h4>
      <p className="mt-1 mb-3 text-center">{emptyListMessage}</p>
      <DrawerOpener drawerId="analyise-report">
        <p className="text-center">
          <Button color="primary" onClick={clearAnalysis}>
            Conduct analysis
          </Button>
        </p>
      </DrawerOpener>
    </div>
  );
};

export default EmptyList;
