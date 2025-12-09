import { Collapse } from "@ims-systems-00/ims-ui-kit";
import PropTypes from "prop-types";
import { useState } from "react";

/**
 * Accordion is mainly used for collapsable views. When the accooding
 * is in a open state all the passed children components render in a
 * collapable pane.
 */
const Accordion = ({ title, open, children }) => {
  if (!title) throw Error("Title is a required property");
  const [isOpen, setIsOpen] = useState(open);
  const toggelOpen = (e) => setIsOpen(!isOpen);
  return (
    <>
      <h5 className={"accordion-title"} onClick={toggelOpen}>
        {!isOpen ? (
          <i className="ims-icons-20 icon-icon-caretdown-24 me-3" />
        ) : (
          <i className="ims-icons-20 icon-icon-caretup-24 me-3" />
        )}
        {title}
      </h5>
      <hr
        className={`accordion-title-separator ${
          !isOpen ? "" : "accordion-title-separator-active"
        }`}
      ></hr>
      <Collapse isOpen={isOpen}>{children}</Collapse>
    </>
  );
};
Accordion.propTypes = {
  /** `tilte` is required because it shows as the text of the collapse  */
  title: PropTypes.string.isRequired,
  /**
   * `open` property decides whether the componet will be opened of collapsed as a default state.
   */
  open: PropTypes.bool,
  /**
   * `children` property can be any react element.
   */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};
export default Accordion;
