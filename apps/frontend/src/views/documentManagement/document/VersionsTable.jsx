import SimpleTable from "@/components/SimpleTable/SimpleTable";
import moment from "moment";
import useDocument from "./store/useDocument";
import VersionsTableActions from "./VersionsTableaActions";

const VersionsTable = ({}) => {
  const { document, versions } = useDocument();
  return (
    <>
      <h5 className="text-center mt-2 mb-2">Document versions</h5>
      <span>
        {document.name} is managed by "{document?.created?.by?.name}"
      </span>
      <SimpleTable
        thead={[
          {
            text: "Version",
            className: "",
          },
          {
            text: "Status",
            className: "",
          },
          {
            text: "Published on",
            className: "",
          },
          {
            text: "Actions",
            className: "",
          },
        ]}
        tbody={versions.map((version) => {
          return {
            data: [
              {
                item: (
                  <span
                    onClick={() => {
                      window.location = `/admin/document-repositories/${version?.repository?._id}/nodes/${version?._id}`;
                    }}
                  >
                    {version.status === "Published" ? (
                      <i className="fa-solid fa-arrow-right-long" />
                    ) : (
                      <i className="fa-solid fa-arrow-up-long" />
                    )}{" "}
                    {version?.documentData?.dvID > 0
                      ? "Version " + version?.documentData?.dvID
                      : "Untracked"}
                  </span>
                ),
              },
              {
                item: (
                  <span>
                    {version?.status === "Published" && (
                      <i className="fa-solid fa-circle-check text-success" />
                    )}
                    {version?.status === "Pending" && (
                      <i className="fa-solid fa-spinner text-warning" />
                    )}
                    {version?.status === "Rejected" && (
                      <i className="fa-solid fa-circle-minus text-danger" />
                    )}
                    {version?.status === "Archived" && (
                      <i className="fa-solid fa-clock text-info" />
                    )}{" "}
                    {version.status}
                  </span>
                ),
              },
              {
                item: version?.created?.on
                  ? moment(version?.created?.on).format("DD/MM/YYYY")
                  : "-",
              },
            ],
            actions: <VersionsTableActions version={version} />,
          };
        })}
      />
    </>
  );
};

export default VersionsTable;
