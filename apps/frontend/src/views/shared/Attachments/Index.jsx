import React from "react";
import Attachment from "./Attachment";
import { Preview } from "./Preview";
export function Attachments({ s3Information = [], children, ...rest }) {
  return (
    <>
      {s3Information &&
        s3Information.map((attachment, index) => {
          return (
            <Attachment
              key={attachment._id}
              attachment={attachment}
              index={index}
            >
              {children}
            </Attachment>
          );
        })}
      <Preview />
    </>
  );
}
