import PropTypes from "prop-types";
/**
 * This is a demo child to be used to mock the children property of any component of iMS
 * in design mode, in ohter words when we are developing and documenting or testing some of our
 * ui `components` we will use this component to pass as a property.
 */
const Child = ({ title, description }) => {
  return (
    <>
      <h4>{title}</h4>
      <p>{description}</p>
    </>
  );
};
Child.propTypes = {
  /** simmple title  */
  title: PropTypes.string,
  /** simple descirpion */
  description: PropTypes.string,
};
export default Child;
