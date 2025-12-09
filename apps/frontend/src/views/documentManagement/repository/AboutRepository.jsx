import { Badge, Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import useRepository from "./store/useRepository";
import React from "react";
import Box from "@/components/Box/Index";

const AboutRepository = ({}) => {
  const { repository } = useRepository();
  return (
    <Box varient="secondary-extra-light" noShadow>
      <Table borderless>
        <tbody>
          <tr>
            <td>Repository Name</td>
            <td className="w-50">{repository?.name}</td>
          </tr>
          <tr>
            <td>Owner(s)</td>
            <td>
              {repository?.owners?.length > 0 && (
                <React.Fragment>
                  {repository?.owners?.map((owner) => (
                    <React.Fragment>
                      <ImageNameWrapper
                        name={owner.name}
                        img={owner.profileImageSrc}
                      />
                      <br></br>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
            </td>
          </tr>
          <tr>
            <td>Created By</td>
            <td>
              <ImageNameWrapper
                img={repository?.created?.by?.profileImageSrc}
                name={repository?.created?.by?.name}
              />
            </td>
          </tr>
          <tr>
            <td>Privacy</td>
            <td>{repository?.privacy}</td>
          </tr>
          <tr>
            <td>Business unit</td>
            <td>{repository?.group?.name || "N/A"}</td>
          </tr>
          <tr>
            <td>Created Date</td>
            <td>{moment(repository?.created?.on).format("LL")}</td>
          </tr>
        </tbody>
      </Table>
    </Box>
  );
};

export default AboutRepository;
