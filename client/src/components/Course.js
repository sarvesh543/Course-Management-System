import React from "react";
//bootstrap
import Card from "react-bootstrap/Card";

export default function Course({ course }) {
  return (
    <Card className="my-2">
      <Card.Header className="clearfix">
        <span>
          {course.courseCode}: {course.name}
        </span>
        <span style={{ float: "right" }}>{course.credits} Credits</span>
      </Card.Header>
      <Card.Body>
        <Card.Text className="mb-0">LTPC: {course.LTPC}</Card.Text>
        <Card.Text className="my-0">Type: {course.typeCourse}</Card.Text>
        <Card.Text className="my-0">Semester: {course.semester}</Card.Text>
        {course.description && (
          <Card.Text as="a" href={course.description} target="_blank">
            Learn More
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
}
