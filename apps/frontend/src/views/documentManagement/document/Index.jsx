import Content from "./Content";
import DocumentContextProvider from "./store/Context";
const Document = (props) => {
  return (
    <div className="content">
      <DocumentContextProvider
        repoId={props.match?.params?.id}
        docId={props.match?.params?.nodeId}
      >
        <Content />
      </DocumentContextProvider>
    </div>
  );
};
export default Document;
