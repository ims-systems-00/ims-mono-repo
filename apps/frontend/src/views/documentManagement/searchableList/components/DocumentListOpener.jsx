import { DrawerOpener } from "@ims-systems-00/ims-ui-kit";

const DocumentListOpener = ({ children }) => {
  return <DrawerOpener drawerId="document-management">{children}</DrawerOpener>;
};
export default DocumentListOpener;
