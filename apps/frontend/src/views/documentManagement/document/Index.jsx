import { DrawerContextProvider } from "@ims-systems-00/ims-ui-kit";
import Content from "./Content";
import DocumentContextProvider from "./store/Context";
const Document = (props) => {
  return (
    <div className="content">
      <DrawerContextProvider>
        <DocumentContextProvider
          repoId={props.match?.params?.id}
          docId={props.match?.params?.nodeId}
        >
          <Content />
        </DocumentContextProvider>
      </DrawerContextProvider>
    </div>
  );
};
export default Document;
