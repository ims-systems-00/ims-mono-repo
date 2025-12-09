import { Button } from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import golivevector from "../../../assets/img/go-live.jpg";

const CreateANewOrganisationPromo = () => {
  const history = useHistory();
  return (
    <div className="text-center my-3">
      <img className="text-center w-50 mx-auto d-block" src={golivevector} />
      <Button
        className="mx-auto"
        color="primary"
        onClick={() => history.push("/auth/onboard/organisation")}
      >
        Create another iMS{" "}
        <i className="ims-icons-20 icon-icon-arrowright-24" />
      </Button>
    </div>
  );
};

export default CreateANewOrganisationPromo;
