import { Button, Row } from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom";
import errorImage from "../../assets/img/404-error-1.png";
import React from "react";

const ErrorHandlerComponent = ({ hasError, errorMessage, children }) => {
  let history = useHistory();
  return (
    <React.Fragment>
      {hasError ? (
        <div className="text-center mt-3">
          <img src={errorImage} style={{ height: "150px" }} />
          <h3 className="text-bold mt-3">Page Not Found</h3>
          <h4 className="text-danger text-center">{errorMessage}</h4>
          <Row className="justify-content-center">
            <Button onClick={() => history.goBack()} className=" btn-simple">
              Go back
            </Button>
          </Row>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </React.Fragment>
  );
};

export default ErrorHandlerComponent;
