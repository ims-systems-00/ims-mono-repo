import CourseTile from "@/components/CourseTile";
import { useTour } from "@/components/Tour";
import useCourses from "@/hooks/useCourses";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";

const Guidelines = () => {
  const { startTour } = useTour();
  const courses = useCourses();

  return (
    <div className="content">
      <Row>
        {Object.keys(courses).map((course) => {
          return (
            <Col md="4" key={course}>
              <CourseTile
                contentCounts={courses[course].steps.length}
                contentType="steps"
                name={courses[course].name}
                description={courses[course].description}
                ctaText="Start Tour"
                onStart={() => {
                  startTour(courses[course]);
                }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Guidelines;
