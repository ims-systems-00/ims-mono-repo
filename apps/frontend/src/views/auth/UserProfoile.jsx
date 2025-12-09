import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { getCurrentUserInfo } from "@/services/userServices";
import defaultAvatar from "@/assets/img/default-avatar.png";
// hard codding now will change in future in the server
let roleMap = {
  super: "Super admin",
  hos: "Head of service",
  basic: "Basic user",
  auditor: "Auditor",
};

const User = () => {
  const [user, setUser] = React.useState(getCurrentUserInfo());
  React.useEffect(() => {
    setUser(getCurrentUserInfo());
  }, []);
  return (
    <>
      <div className="content">
        <Row>
          <Col md="8" className="mx-auto">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img alt="..." className="avatar" src={defaultAvatar} />
                    <span className="title">{user.name}</span>
                  </a>
                  <p className="description">
                    System role : {roleMap[user.role.name]}
                  </p>
                </div>
                <div className="card-description">
                  {/* will put user description here*/}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="8" className="mx-auto">
            <Card>
              <CardHeader>
                <span className="title">Edit Profile</span>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-md-1" md="5">
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input
                          defaultValue={user.organizationId.name}
                          disabled
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="px-md-1" md="3">
                      <FormGroup>
                        <label>Name</label>
                        <Input defaultValue={user.name} type="text" />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                        <label>Email address</label>
                        <Input
                          disabled
                          defaultValue={user.email}
                          type="email"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  {user.busisnessFunctionId && (
                    <Row>
                      <Col className="pr-md-1" md="4">
                        <FormGroup>
                          <label>Business function</label>
                          <Input
                            defaultValue={user.businessFunctionId.name}
                            disabled
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-md-1" md="4">
                        <FormGroup>
                          <label>Job role</label>
                          <Input defaultValue="jobrole here" type="text" />
                        </FormGroup>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col md="8">
                      <FormGroup>
                        <label>About Me</label>
                        <Input
                          cols="80"
                          defaultValue=""
                          placeholder="Here can be your description"
                          rows="4"
                          type="textarea"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button type="button" className="btn-fill" color="primary">
                    Save
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default User;
