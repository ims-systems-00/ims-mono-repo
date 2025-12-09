// import React from "react";
// import TextEditorContextProvider from "./Context";
// import TextEditor from "./TextEditor";
// const FormatedContents = (props) => {
//   return (
//     <TextEditorContextProvider {...props}>
//       <TextEditor {...props} readOnly={true} />
//     </TextEditorContextProvider>
//   );
// };

/**
 * [bring-new-design-and-remove-this]
 */

import { TextEditor } from "@ims-systems-00/ims-ui-kit";

export default function Index(props) {
  return <TextEditor {...props} readOnly />;
}
