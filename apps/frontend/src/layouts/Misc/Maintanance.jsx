const Maintanance = (props) => {
  function getPercentage() {}
  return (
    <div className="wrapper">
      <div className="container h-100">
        <div className="row-grid justify-content-between align-items-center text-left row h-100">
          <div className="col-md-6 col-lg-6">
            <h3 className="">
              We are under maintenance<span className=""></span>
            </h3>
            <p className="mb-3">
              Thank you for your patience. We shall be back in few hours.
            </p>
            <div className="btn-wrapper mb-3">
              <p className="category text-primary d-inline">iMS Systems home</p>
              <a
                href="https://imssystems.tech"
                className="ms-3 btn btn-success btn-sm"
              >
                <i className="ims-icons-20 icon-icon-arrowright-24"></i>
              </a>
            </div>
          </div>
          <div className="col-md-5 col-lg-4"></div>
        </div>
      </div>
    </div>
  );
};
export default Maintanance;
