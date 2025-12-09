import Content from "./Content";
import DataImportContextProvider from "./importerStore/Context";
const DataImport = (props) => {
  return (
    <DataImportContextProvider>
      <div className="content">
        <Content />
      </div>
    </DataImportContextProvider>
  );
};

export default DataImport;
