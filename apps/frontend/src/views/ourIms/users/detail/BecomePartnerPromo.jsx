import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  UncontrolledAlert,
} from "@ims-systems-00/ims-ui-kit";
import { useDualStateController } from "@ims-systems-00/ims-react-hooks";
import golivevector from "../../../../assets/img/go-live.jpg";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BecomePartnerPromo = () => {
  const { isOpen: isOpen, toggle: toggle } = useDualStateController();
  const history = useHistory();
  return (
    <div className="my-3">
      <UncontrolledAlert color="primary">
        Join our partnership programme. Provide an additional service provision
        to your existing customer base.
        <Button
          color="primary"
          outline
          className="border-0"
          size="sm"
          onClick={toggle}
        >
          View
        </Button>
      </UncontrolledAlert>
      <img className="text-center w-50 mx-auto d-block" src={golivevector} />
      <Button
        block
        color="primary"
        onClick={() => history.push("/auth/onboard/partner")}
      >
        Become a partner <i className="ims-icons-20 icon-icon-arrowright-24" />
      </Button>
      <Modal isOpen={isOpen} centered toggle={toggle} backdrop={false}>
        <ModalBody>
          <iframe
            style={{ borderRadius: 10 }}
            width="100%"
            height="514"
            src="https://www.youtube.com/embed/RuhhBGjYwH0"
            title="iMS Systems Partnership Programme"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            color="danger"
            className=" btn-block ml-auto"
            onClick={toggle}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BecomePartnerPromo;
