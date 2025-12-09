// import React from "react";
// import TextEditorContextProvider from "./Context";
// import WrappedEditor from "./WrappedEditor";
// export default function Index(props) {
//   return (
//     <TextEditorContextProvider {...props}>
//       <WrappedEditor {...props} />
//     </TextEditorContextProvider>
//   );
// }

/**
 * [bring-new-design-and-remove-this]
 */

import { TextEditor } from "@ims-systems-00/ims-ui-kit";

export default function Index(props) {
  return <TextEditor {...props} />;
}
