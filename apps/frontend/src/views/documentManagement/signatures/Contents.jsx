import { Card, CardBody } from "@ims-systems-00/ims-ui-kit";
import RequestsTable from "./RequestsTable";
import useSignature from "./store/useSignature";
const Contents = (props) => {
  let { signatures } = useSignature();
  return (
    <Card>
      <CardBody>
        <RequestsTable />
      </CardBody>
    </Card>
  );
};

export default Contents;
