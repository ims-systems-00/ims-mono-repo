const RowExpanded = ({ data }) => {
  return (
    <div className="">
      <p>
        <span className="font-weight-bold">Clause: </span>
        {data.clause}
      </p>

      <p>
        <span className="font-weight-bold">Title: </span>
        {data.title}
      </p>

      <p>
        <span className="font-weight-bold">Requirement met: </span>
        {data.requirementMet}
      </p>
      {data.description && (
        <p>
          <span className="font-weight-bold">Description: </span>
          {data.description}
        </p>
      )}
    </div>
  );
};

export default RowExpanded;
