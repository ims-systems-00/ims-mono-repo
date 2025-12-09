export const EmptyContent = ({ height = 200, children }) => {
  return (
    <div
      style={{
        height,
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {children}
    </div>
  );
};
