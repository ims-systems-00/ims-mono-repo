import React from "react";
import ReactBSAlert from "react-bootstrap-sweetalert";
import successIcon from "../assets/img/success.png";
import warningIcon from "../assets/img/warning-icon.png";

const useAlerts = () => {
  const [alert, setAlert] = React.useState(null);
  // to stop the warning of calling setState of unmounted component
  React.useEffect(() => {
    return function cleanup() {
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  const basicAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      />
    );
  };
  const titleAndTextAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Here's a message!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize="sm"
      >
        It's pretty, isn't it?
      </ReactBSAlert>
    );
  };
  const successAlert = (msg) => {
    setAlert(
      <ReactBSAlert
        custom
        customIcon={successIcon}
        style={{ display: "block", marginTop: "-100px" }}
        title=""
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="btn-default"
        btnSize="sm"
      >
        <p className="text-dark">{msg}</p>
      </ReactBSAlert>
    );
  };
  const failedAlert = (msg) => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title=""
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize="sm"
      >
        <p className="text-dark">{msg}</p>
      </ReactBSAlert>
    );
  };
  const infoAlert = (msg) => {
    setAlert(
      <ReactBSAlert
        info
        style={{ display: "block", marginTop: "-100px" }}
        title=""
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize="sm"
      >
        <p className="text-dark">{msg}</p>
      </ReactBSAlert>
    );
  };
  const htmlAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="HTML example"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        You can use <b>bold</b> text,{" "}
        <a href="https://imssystems.tech/">links</a> and other HTML tags
      </ReactBSAlert>
    );
  };
  const warningWithConfirmMessage = (msg, onConfirm) => {
    setAlert(
      <ReactBSAlert
        custom
        customIcon={warningIcon}
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          onConfirm();
          hideAlert();
        }}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Confirm !"
        cancelBtnText="Cancel"
        showCancel
        btnSize="sm"
      >
        <p className="text-dark">{msg}</p>
      </ReactBSAlert>
    );
  };
  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete()}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this imaginary file!
      </ReactBSAlert>
    );
  };
  const autoCloseAlert = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Auto close alert!"
        onConfirm={() => hideAlert()}
        showConfirm={false}
      >
        I will close in 2 seconds.
      </ReactBSAlert>
    );
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };
  const inputAlert = () => {
    setAlert(
      <ReactBSAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={(e) => inputConfirmAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        cancelBtnBsStyle="danger"
        btnSize=""
      />
    );
  };
  const inputConfirmAlert = (e) => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
        title="You entered: "
      >
        <b>{e}</b>
      </ReactBSAlert>
    );
  };
  const successDelete = () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Deleted!"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file has been deleted.
      </ReactBSAlert>
    );
  };
  const cancelDetele = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="success"
        btnSize=""
      >
        Your imaginary file is safe :)
      </ReactBSAlert>
    );
  };
  const importantAlerts = (msg) => {
    return new Promise((resolve, _) => {
      setAlert(
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title=""
          onConfirm={() => {
            resolve("Confirmed");
            hideAlert();
          }}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="btn-default"
          btnSize="sm"
        >
          <p className="text-dark">{msg}</p>
        </ReactBSAlert>
      );
    });
  };

  const popUpAlerts = (msg, options) => {
    return new Promise((resolve, _) => {
      setAlert(
        <ReactBSAlert
          custom
          customIcon={options.icon || successIcon}
          style={{ display: "block", marginTop: "-100px" }}
          title=""
          onConfirm={() => {
            resolve("Confirmed");
            hideAlert();
          }}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="btn-default"
          btnSize="sm"
        >
          <p className="text-dark">{msg}</p>
        </ReactBSAlert>
      );
    });
  };

  const hideAlert = () => {
    setAlert(null);
  };
  return {
    alert,
    basicAlert,
    cancelDetele,
    successDelete,
    inputConfirmAlert,
    inputAlert,
    autoCloseAlert,
    warningWithConfirmAndCancelMessage,
    warningWithConfirmMessage,
    htmlAlert,
    successAlert,
    titleAndTextAlert,
    failedAlert,
    infoAlert,
    importantAlerts,
    popUpAlerts,
  };
};

export default useAlerts;
