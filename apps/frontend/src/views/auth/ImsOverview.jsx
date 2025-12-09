const ImsOverview = () => {
  return (
    <>
      <div className="info-area info-horizontal">
        <div className="icon icon-success">
          <i className="tim-icons icon-components" />
        </div>
        <div className="description">
          <h1 className="info-title">Welcome to the data driven world</h1>
          <p className="description">
            Enabling executives to make informed strategic decisions based on
            real time data. Improving the flow of information.
          </p>
        </div>
      </div>
      <div className="info-area info-horizontal mt-5 mb-5">
        <div className="icon icon-primary">
          <i className="tim-icons icon-tv-2" />
        </div>
        <div className="description">
          <h1 className="info-title">One centralised portal</h1>
          <p className="description">
            Manage your risks, incidents, documents, suppliers, compliance and
            much more with just one system.<br></br>
            <br></br>
            That's iMS systems
          </p>
        </div>
      </div>
    </>
  );
};

export default ImsOverview;
