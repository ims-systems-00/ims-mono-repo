import Contents from "./Contents";
import SignaturesContextProvider from "./store/Context";
const Signatures = (props) => {
  return (
    <div className="content">
      <SignaturesContextProvider>
        <Contents />
      </SignaturesContextProvider>
    </div>
  );
};

export default Signatures;
