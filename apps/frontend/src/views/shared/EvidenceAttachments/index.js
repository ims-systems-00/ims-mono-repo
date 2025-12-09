import React from 'react';
import { EvidenceAttachmentContextProvider } from './store';
import { Attachments } from './Attachment';

export const EvidenceAttachments = ({
  controlId = null,
  readOnly = false,
  disableEmptyBlock = false,
}) => {
  return (
    <EvidenceAttachmentContextProvider
      controlId={controlId}
      readOnly={readOnly}
      disableEmptyBlock={disableEmptyBlock}
    >
      <Attachments />
    </EvidenceAttachmentContextProvider>
  );
};
