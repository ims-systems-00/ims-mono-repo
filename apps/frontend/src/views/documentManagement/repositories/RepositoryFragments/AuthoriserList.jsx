const AuthoriserList = ({
  heading = "Authoriser List",
  authoriserTableList = [],
  node = {},
  ...props
}) => {
  return (
    <>
      {authoriserTableList.length > 0 && (
        <div className="signee-list-container">
          <div className="signee-list-header">
            <h4>{heading}</h4>
          </div>
          <div className="signee-list-body table-responsive ">
            <table className="w-100 table-sm table-layout-fixed">
              <thead>
                <tr>
                  <th>Authoriser</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {authoriserTableList.map((authoriser) => {
                  return (
                    <tr>
                      <td data-toggle="tooltip" title={authoriser?.user?.name}>
                        {authoriser?.user?.name?.split("@")[0].substring(0, 13)}
                      </td>
                      <td
                        className={`${
                          authoriser.status === "Approved"
                            ? "text-success"
                            : "text-secondary"
                        }`}
                      >
                        {authoriser.status}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthoriserList;
