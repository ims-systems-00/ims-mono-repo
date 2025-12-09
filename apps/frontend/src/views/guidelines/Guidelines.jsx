import CourseTile from "@/components/CourseTile";
import { useTour } from "@/components/Tour";
import useCourses from "@/hooks/useCourses";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const Guidelines = () => {
  const { startTour } = useTour();
  const { businessUnitCourse, userManagementCourse, businessPremisesCourse, createRepositoriesCourse } =
    useCourses();

  return (
    <div className="content">
      <Row>
        <Col md="3">
          <CourseTile
            name="Business Units"
            contentType="Steps"
            contentCounts={businessUnitCourse.steps.length}
            description="Learn how to create, edit, and manage business units in the system."
            ctaText="Start Tour"
            onStart={() => {
              startTour(businessUnitCourse);
            }}
          />
        </Col>
        <Col md="3">
          <CourseTile
            name="User Management"
            contentType="Steps"
            contentCounts={userManagementCourse.steps.length}
            description="Understand how to track and manage your users."
            ctaText="Start Tour"
            onStart={() => {
              startTour(userManagementCourse);
            }}
          />
        </Col>
        <Col md="3">
          <CourseTile
            name="Business Premises"
            contentType="Steps"
            contentCounts={businessPremisesCourse.steps.length}
            description="Learn how to navigate business premises and understand key metrics."
            ctaText="Start Tour"
            onStart={() => {
              startTour(businessPremisesCourse);
            }}
          />
        </Col>
        <Col md="3">
          <CourseTile
            name="Create Repositories"
            contentType="Steps"
            contentCounts={createRepositoriesCourse.steps.length}
            description="Create and manage repositories with a quick walkthrough."
            ctaText="Start Tour"
            onStart={() => {
              startTour(createRepositoriesCourse);
            }}
          />
        </Col>
        {/* <Col md="3">
          <CourseTile
            name="Custom Tour"
            contentType="Steps"
            contentCounts={3}
            description="A custom walkthrough of this tour manager page."
            ctaText="Start Tour"
            onStart={startDashboardTour}
          />
        </Col> */}
      </Row>
    </div>
  );
};

export default Guidelines;