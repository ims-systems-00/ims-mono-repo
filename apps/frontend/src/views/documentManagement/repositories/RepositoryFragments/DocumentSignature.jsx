import IMSSelectDropdown from "@/components/SelectDropdown/IMSSelectDropdown";
import { Button } from "@ims-systems-00/ims-ui-kit";
import React, { useState } from "react";

const DocumentSignature = ({ fileDetails, node, ...props }) => {
  const [signatureDetail, setSignatureDetail] = useState({
    name: "",
    color: {
      name: "text-dark",
      hexCode: "#000000",
    },
    font: "",
    fontName: "",
    signaturePosition: {
      x: 0,
      y: 0,
    },
    signPlaced: false,
    totalPages: 1,
    selectedPage: 1,
  });
  const [signature, setSignature] = React.useState("");
  //#1d8cf8 = text-info
  //#FD5D93 = text-danger

  const [color, setColor] = React.useState("black");

  //for now the condition is set to false so that we can work on the component
  return (
    <>
      {node?.status !== "Pending" && (
        <div className="container mt-5 signature-wrapper">
          <p className="mb-3">
            <span className="text-danger">{node?.created?.by?.name} </span>{" "}
            uploaded this document and asking your permission to publish. Please
            add a signature & select the Accept button to publish.
          </p>
          <div className="signature-container">
            <div className="signature-header">Add Signature</div>
            <div className="signature-body">
              <div className="signature-area mb-3 d-flex flex-column mx-auto">
                <div className="signature-tools d-flex justify-content-between align-items-center flex-wrap">
                  <div className="signature-fonts-container">
                    <IMSSelectDropdown
                      // disabled={isMoveDropdownOpen}
                      showValue={true}
                      buttonText={"Select Typeface"}
                      listItems={["Arial", "Courgette", "Poppins"]}
                      onSelect={(value) => {
                        setSignatureDetail((prev) => {
                          return {
                            ...prev,
                            font: "sign-" + value.toLowerCase(),
                            fontName: value,
                          };
                        });
                      }}
                    />
                  </div>
                  <div className="signature-colors-container mt-lg-0 mt-2">
                    <i
                      onClick={(e) => {
                        setColor("black");
                        setSignatureDetail((prev) => {
                          return {
                            ...prev,
                            color: {
                              name: "text-dark",
                              hexCode: "#000000",
                            },
                          };
                        });
                      }}
                      className={`fa-solid ${
                        color === "black"
                          ? "fa-circle-check active-color"
                          : "fa-circle"
                      }`}
                    ></i>
                    <i
                      onClick={(e) => {
                        setColor("blue");
                        setSignatureDetail((prev) => {
                          return {
                            ...prev,
                            color: {
                              name: "text-info",
                              hexCode: "#1d8cf8",
                            },
                          };
                        });
                      }}
                      className={`fa-solid ${
                        color === "blue"
                          ? "fa-circle-check active-color"
                          : "fa-circle"
                      } text-info mx-2`}
                    ></i>
                    <i
                      onClick={(e) => {
                        setColor("red");
                        setSignatureDetail((prev) => {
                          return {
                            ...prev,
                            color: {
                              name: "text-danger",
                              hexCode: "#FD5D93",
                            },
                          };
                        });
                      }}
                      className={`fa-solid ${
                        color === "red"
                          ? "fa-circle-check active-color"
                          : "fa-circle"
                      } text-danger`}
                    ></i>
                  </div>
                </div>
                <div
                  className="signature-input-container flex-grow-1 d-flex justify-content-center 
                align-items-center"
                >
                  <div>
                    <input
                      disabled={signatureDetail.font === ""}
                      spellCheck="false"
                      onChange={(e) => {
                        setSignature(e.target.value);
                      }}
                      value={signature}
                      maxLength={12}
                      placeholder="Your Signature"
                      type="text"
                      className={`
                    ${
                      color === "red"
                        ? "text-danger"
                        : color === "blue"
                        ? "text-info"
                        : "text-dark"
                    }
                    ${signatureDetail.font}
                    `}
                    />
                    <div className="horizontal-line"></div>
                  </div>
                </div>
              </div>
              <p>
                By signing this document with an electronic signature, I agree
                that such signature will bw valid as handwritten signatures to
                the extent allowed by local law
              </p>
            </div>
            <div className="signature-footer d-flex justify-content-end">
              <div className="ims-faded-button">
                <Button>Cancel</Button>
                <Button onClick={() => {}}>
                  <span className="text-info">Accept & Sign</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentSignature;
