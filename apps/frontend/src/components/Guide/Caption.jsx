const Caption = ({ children, className = "" }) => {
  return (
    <div className={`carousel-caption ${className}`}>
      {children}
    </div>
  );
};

Caption.displayName = 'Caption';

export default Caption;


