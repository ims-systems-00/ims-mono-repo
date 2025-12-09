/**
 * CAUTION: This component is restricted to be coupled with
 * the store. This is meant to be utilised
 * as an independent component only to show case data.
 */
import FilePreviewer from "@/components/Previewer/FilePreviewer";
import React from "react";
import { useSearchableDocument } from "../store";
import { Link } from "react-router-dom";

const Document = () => {
  const { visitingDocument } = useSearchableDocument();
  return (
    <React.Fragment>
      <Link
        className="text-right text-secondary"
        to={`/admin/document-repositories/${visitingDocument?.repository?._id}/nodes/${visitingDocument?._id}`}
      >
        <i className="ims-icons-20 icon-icon-file-24" /> Open in document
        management
      </Link>
      {visitingDocument?.documentData?.storageInfo && (
        <FilePreviewer
          fileDetails={visitingDocument?.documentData?.storageInfo}
        />
      )}
    </React.Fragment>
  );
};

export default Document;
