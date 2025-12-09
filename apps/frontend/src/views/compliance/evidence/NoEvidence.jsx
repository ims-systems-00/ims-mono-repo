import { EmptyContent } from "@/components/EmptyContent";

export const NoEvidenceFound = ({ text }) => {
  return (
    <EmptyContent height={200}>
      <div className="h-100 w-100 d-flex bg-secondary-extra-light rounded-3 justify-content-center align-items-center">
        <p>{text}</p>
      </div>
    </EmptyContent>
  );
};
