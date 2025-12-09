import useDataProcessing from "@/hooks/useProcessing";
import { imsLogger } from "@/services/loggerService";
import { downloader } from "@/services/utils/downloader";

export function Report({ text, fileName, reportApi, className }) {
  let { btnProcessing, setProcessing, processing } = useDataProcessing();
  async function download(fileName, reportApi) {
    setProcessing({ action: "download" });
    try {
      let { data } = await reportApi();
      downloader(fileName, data);
    } catch (ex) {
      imsLogger("Report", ex);
    }
    setProcessing(false);
  }
  return (
    <>
      {processing.action === "download" ? (
        <span className={"text-warning " + className}>
          {btnProcessing()} Downloading ...
        </span>
      ) : (
        <span className={"text-info " + className}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => {
              download(fileName, reportApi);
            }}
          >
            {text} <i className="fa fa-download" />
          </span>
        </span>
      )}
    </>
  );
}
