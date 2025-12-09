import { EvidenceAttachments } from "@/views/shared/EvidenceAttachments";

export const LikedFile = ({ controlStatusId }) => {
  return (
    <div>
      <h5 className="mb-3 fw-bold">Linked File Evidence:</h5>
      <EvidenceAttachments controlId={controlStatusId} readOnly={true} />
    </div>
  );
};
