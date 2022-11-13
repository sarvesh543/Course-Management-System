import React, { useEffect, useState } from "react";
//bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
//redux
import { useSelector, useDispatch } from "react-redux";
import {
  getAvailableCourses,
  clearErrors,
  addCourses,
} from "../redux/userActions";

export default function CourseList() {
  const dispatch = useDispatch();
  const { courses, user, errors } = useSelector((state) => state.user);
  const [availableCourses, setAvailableCourses] = useState(courses);
  const [staged, setStaged] = useState([]);
  //defaults
  let numToType = [
    "Not offered",
    "Institute Core",
    "Discipline Core",
    "Discipline Elective",
    "Free Elective",
  ];
  let defaultCourses = courses.map((course) => {
    return {
      name: course.name,
      courseCode: course.courseCode,
      semester: course.semester,
      description: course.description,
      LTPC: course.LTPC,
      credits: course.credits,
      typeCourse: numToType[course[user.branch]],
      selected: false,
    };
  });
  // initial
  useEffect(() => {
    let numToType = [
      "Not offered",
      "Institute Core",
      "Discipline Core",
      "Discipline Elective",
      "Free Elective",
    ];
    setStaged([]);
    setAvailableCourses(
      courses.map((course) => {
        return {
          name: course.name,
          courseCode: course.courseCode,
          semester: course.semester,
          description: course.description,
          LTPC: course.LTPC,
          credits: course.credits,
          typeCourse: numToType[course[user.branch]],
          selected: false,
        };
      })
    );
  }, [courses, user]);
  useEffect(() => {
    dispatch(getAvailableCourses(user._id));
  }, [user, dispatch]);
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);
  //funcs
  const handleSelect = (eventKey) => {
    switch (eventKey) {
      case "C":
        // 1 is institute core and 2 is discipline core
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [1, 2].includes(course[user.branch]);
          })
        );
        break;
      case "DE":
        // 3 is discipline elective
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [3].includes(course[user.branch]);
          })
        );
        break;
      case "FE":
        // 4 is free elective
        setAvailableCourses(
          defaultCourses.filter((course) => {
            return [4].includes(course[user.branch]);
          })
        );
        break;
      default:
        //aa
        setAvailableCourses(defaultCourses);
    }
  };
  const cancelChanges = (e) => {
    e.preventDefault();
    setStaged([]);
    setAvailableCourses(
      availableCourses.map((course) => {
        return { ...course, selected: false };
      })
    );
  };
  const handleStage = (e, index) => {
    e.preventDefault();
    const course = availableCourses.filter((course, idx) => idx === index)[0];
    setStaged([...staged, course]);
    setAvailableCourses(
      availableCourses.map((course, idx) => {
        if (idx === index) {
          return { ...course, selected: true };
        } else return course;
      })
    );
  };
  const jsx = (
    <>
      {availableCourses?.length === 0 && (
        <h3 className="py-2">No courses in this category</h3>
      )}
      {availableCourses?.length > 0 && (
        <>
          <Card className="shadow">
            <Card.Body>
              {availableCourses?.map((course, index) => (
                <Card
                  key={index}
                  className="my-2"
                  style={{ opacity: course.selected ? 0.5 : 1.0 }}
                >
                  <Card.Header className="clearfix">
                    <span>
                      {course.courseCode}: {course.name}
                    </span>
                    <span style={{ float: "right" }}>
                      {course.credits} Credits
                    </span>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ display: "inline-block" }}>
                      <Card.Text className="mb-0">
                        LTPC: {course.LTPC}
                      </Card.Text>
                      <Card.Text className="my-0">
                        Type: {course.typeCourse}
                      </Card.Text>
                      <Card.Text className="my-0">
                        Semester: {course.semester}
                      </Card.Text>
                      {course.description && (
                        <Card.Text
                          as="a"
                          href={course.description}
                          target="_blank"
                        >
                          Learn More
                        </Card.Text>
                      )}
                    </div>
                    <Button
                      variant="danger"
                      className="my-auto"
                      style={{
                        float: "right",
                        display: "inline-block",
                      }}
                      onClick={(e) => handleStage(e, index)}
                      disabled={course.selected}
                    >
                      Add
                    </Button>
                  </Card.Body>
                </Card>
              ))}
              <Card.Text
                className="my-auto"
                style={{
                  float: "left",
                  display: "inline-block",
                }}
              >
                Total Credits:{" "}
                {staged.reduce(
                  (acc, curr) => {
                    return acc + curr.credits;
                  },
                  user.courses.reduce((acc2, curr2) => {
                    return acc2 + curr2.credits;
                  }, 0)
                )}
              </Card.Text>
              <Button
                className="my-auto mx-1"
                style={{
                  float: "right",
                  display: "inline-block",
                }}
                onClick={(e) => cancelChanges(e)}
                disabled={staged.length === 0}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="my-auto mx-1"
                style={{
                  float: "right",
                  display: "inline-block",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(addCourses(staged));
                }}
                disabled={staged.length === 0}
              >
                Apply
              </Button>
              <br />
              <Card.Text
                style={{
                  float: "left",
                  display: "inline-block",
                }}
                className="text-danger pb-1 text-center"
              >
                {errors.general ? errors.general : ""}
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );

  return (
    <div className="container">
      <Tabs
        defaultActiveKey="all"
        onSelect={handleSelect}
        variant="tabs"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab eventKey="all" title="All Courses">
          {jsx}
        </Tab>
        <Tab eventKey="C" title="Core">
          {jsx}
        </Tab>
        <Tab eventKey="DE" title="Discipline Elective">
          {jsx}
        </Tab>
        <Tab eventKey="FE" title="Free Elective">
          {jsx}
        </Tab>
      </Tabs>
    </div>
  );
}
