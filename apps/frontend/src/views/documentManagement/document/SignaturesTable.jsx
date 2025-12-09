import SimpleTable from "@/components/SimpleTable/SimpleTable";
import moment from "moment";
import SignatureTableActions from "./SignatureTableActions";
import useDocument from "./store/useDocument";

const SignaureTableActions = ({}) => {
  const { signatures, document } = useDocument();
  return (
    <>
      <span>
        {document.name} is managed by "{document?.created?.by?.name}"
      </span>
      <SimpleTable
        thead={[
          {
            text: "Name/Email",
            className: "",
          },
          {
            text: "Date sent",
            className: "",
          },
          {
            text: "Status",
            className: "",
          },
          {
            text: "Signature",
            className: "",
          },
          {
            text: "Date",
            className: "",
          },
          {
            text: "Actions",
            className: "",
          },
        ]}
        tbody={signatures.map((signature) => {
          return {
            data: [
              {
                item: (
                  <span>
                    {signature.type === "Internal" ? (
                      <i className="fa-solid fa-person-arrow-down-to-line" />
                    ) : (
                      <i className="fa-solid fa-person-arrow-up-from-line" />
                    )}{" "}
                    {signature.user?.internalRef?.name ||
                      signature.user?.externalEmail}
                  </span>
                ),
              },
              {
                item: moment(signature?.createdAt).format("DD/MM/YYYY"),
              },
              {
                item: (
                  <span>
                    {signature.status === "Pending" ? (
                      <i className="fa-solid fa-spinner" />
                    ) : (
                      <i className="fa-solid fa-signature" />
                    )}{" "}
                    {signature.status}
                  </span>
                ),
              },
              {
                item: (
                  <span className={`text-${signature.data.font}`}>
                    {signature.data.signature || "-"}
                  </span>
                ),
              },
              {
                item: signature?.signedAt ? (
                  moment(signature?.signedAt).format("DD/MM/YYYY")
                ) : (
                  <i className="fa-solid fa-spinner" />
                ),
              },
            ],
            actions: <SignatureTableActions signature={signature} />,
          };
        })}
      />
    </>
  );
};

export default SignaureTableActions;
