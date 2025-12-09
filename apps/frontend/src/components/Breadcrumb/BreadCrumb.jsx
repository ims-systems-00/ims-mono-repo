import classNames from "classnames";
import { Breadcrumb, BreadcrumbItem } from "@ims-systems-00/ims-ui-kit";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { truncateMiddle } from "@/utils/truncate";

/**
 * Breadcrumb is mainly used for displaying
 * the current page location in a hierarchical
 * manner with a link to the parent page of the current page.
 */

const BreadCrumb = ({
  crumbs = [],
  listTag = "div",
  listClassName = "breadcrumb",
  onSelect = () => {},
}) => {
  //a deep copy of crumbs array
  let crumbsList = JSON.parse(JSON.stringify(crumbs));

  //shortens crumbs array if too long
  if (crumbsList && crumbsList.length > 3) {
    let firstCrumb = crumbs[0];
    let lastCrumb = crumbs[crumbs.length - 1];
    let secondLastCrumb = crumbs[crumbs.length - 2];
    let middleCrumbs = [
      {
        name: "....",
      },
    ];
    crumbsList = [firstCrumb, ...middleCrumbs, secondLastCrumb, lastCrumb];
  }

  return (
    <div className={`${crumbsList.length < 1 ? "invisible" : ""}`}>
      <div className="breadcrumb-container">
        <Breadcrumb
          listTag={listTag}
          listClassName={classNames(listClassName, "m-0")}
        >
          {crumbsList.length > 1 &&
            crumbsList?.map((crumb, key) => {
              const { name, nodeId } = crumb;
              return (
                <>
                  <BreadcrumbItem
                    data-toggle="tooltip"
                    title={name !== "...." ? name : ""}
                    className={`${
                      key === crumbsList.length - 1
                        ? "active-breadcrumb-item"
                        : ""
                    }`}
                    onClick={() => onSelect(nodeId)}
                    key={key}
                  >
                    <Link to="#">
                      {name.length > 20 ? truncateMiddle(name) : name}
                    </Link>
                  </BreadcrumbItem>
                </>
              );
            })}
        </Breadcrumb>
      </div>
    </div>
  );
};

BreadCrumb.propTypes = {
  /**
   * `listTag` property is the type of the element. It can be any valid html tag.
   *
   */
  listTag: PropTypes.string.isRequired,
  /**
   * `listClassName` property is the class name of the element.
   */
  listClassName: PropTypes.string,
  /**
   * `listStyle` property is the style of the element.
   */
  listStyle: PropTypes.object,
  /**
   * `crumbs` property is an array of objects. Each object has the following properties: `href`, `tag`, `children`, `active`. `href` property is the link to the parent page of the current page. `tag` property is the type of the element. It can be any valid html tag.`children` property is the text to be displayed. `active` property is a boolean value. If it is true, the current page is the last page in the breadcrumb.
   */
  crumbs: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      tag: PropTypes.string,
      children: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
  /**
   * `onSelect` property is a function that is called when the user clicks on the breadcrumb.
   */
  onSelect: PropTypes.func,
};

export default BreadCrumb;
