import React from "react";
import { imsLogger } from "@/services/loggerService";
import NetworkSpeed from "network-speed";
const testNetworkSpeed = new NetworkSpeed();
async function getNetworkDownloadSpeed() {
  const baseUrl = "https://eu.httpbin.org/stream-bytes/500000";
  const fileSizeInBytes = 500000;
  imsLogger("starting test");
  // const speed = await Promise.all([...Array(30).keys()].map(_itr=>testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes)))
  let speed = 0;
  let limit = 10;
  for (let i = 0; i < limit; i++) {
    let res = await testNetworkSpeed.checkDownloadSpeed(
      baseUrl,
      fileSizeInBytes
    );
    speed = speed + parseInt(res.mbps);
  }
  imsLogger(speed / limit);
}
async function getNetworkUploadSpeed() {
  const options = {
    hostname: "www.google.com",
    port: 80,
    path: "/catchers/544b09b4599c1d0200000289",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const fileSizeInBytes = 2000000;
  const speed = await testNetworkSpeed.checkUploadSpeed(
    options,
    fileSizeInBytes
  );
  imsLogger(speed);
}
const NetSpeedTest = () => {
  async function runTests() {
    try {
      getNetworkDownloadSpeed();
    } catch (ex) {
      imsLogger("NetSpeedTest", ex, ex.response);
    }
  }
  React.useEffect(() => {
    runTests();
  }, []);
  return (
    <div>
      <iframe
        width="100%"
        height="650px"
        frameborder="0"
        src="https://imssystems.speedtestcustom.com"
      ></iframe>
    </div>
  );
};

export default NetSpeedTest;
