import React from "react";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";

const SafeHtml = ({ html, ...rest }) => {
  return <div {...rest}>{ReactHtmlParser(html)}</div>;
};

export default SafeHtml;
