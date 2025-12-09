import { Table } from "@ims-systems-00/ims-ui-kit";
const LicenseOverview = ({ group }) => {
  return (
    <Table>
      {/* <thead>
        <tr>
          <th>Roles</th>
          <th>Used</th>
        </tr>
      </thead> */}
      <tbody>
        {/* {getRoles(group).map((role) => (
          <tr key={role.name}>
            <td>{role.name}</td>
            <td>{group.userLicenses[role.accessor].used}</td>
          </tr>
        ))} */}
      </tbody>
    </Table>
  );
};

export default LicenseOverview;
