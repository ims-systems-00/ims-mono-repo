import emptyRepository from "@/assets/img/empty-repository.png";
import SimpleTable from "@/components/SimpleTable/SimpleTable";
import RequestTableActions from "./RequestTableActions";
import useSignature from "./store/useSignature";

const RequestsTable = ({}) => {
  const { signatures } = useSignature();
  return (
    <div className="doc-table-container mb-lg-3 rounded">
      <span>Signature requests</span>
      {signatures?.length > 0 ? (
        <div className="doc-table-wrapper">
          <SimpleTable
            thead={[
              {
                text: "Repository",
                className: "",
              },
              {
                text: "Document",
                className: "",
              },
              {
                text: "Status",
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
                    item: signature.repository?.name,
                  },
                  {
                    item: signature.node?.name,
                  },
                  {
                    item: signature.status,
                  },
                  {
                    item: signature.message,
                  },
                ],
                actions: <RequestTableActions request={signature} />,
              };
            })}
          />
        </div>
      ) : (
        <div className="d-flex justify-content-center py-5">
          <img src={emptyRepository} alt="" />
        </div>
      )}
    </div>
  );
};

export default RequestsTable;
