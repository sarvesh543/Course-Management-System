import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//bootstrap
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
//redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, dropCourses, getUser, logoutUser } from "../redux/userActions";
//components
import CourseList from "../components/CourseList";

export default function AddDrop() {
  const dispatch = useDispatch();
  const { user, errors, registration } = useSelector((state) => state.user);
  const [coursesChosen, setCoursesChosen] = useState([]);
  const [dropStaged, setDropStaged] = useState([]);

  let numToType = [
    "Not offered",
    "Institute Core",
    "Discipline Core",
    "Discipline Elective",
    "Free Elective",
  ];

  useEffect(()=>{
    dispatch(getUser(localStorage.getItem("token")));
  },[])

  useEffect(() => {
    setDropStaged([]);
    const defaultCourses = user.courses
      .filter((course) => {
        return course.semester === user.semester;
      })
      .map((course) => {
        return { ...course, selected: false };
      });
    setCoursesChosen(defaultCourses);
  }, [user]);
  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);
  const cancelChanges = (e) => {
    e.preventDefault();
    setDropStaged([]);
    setCoursesChosen(
      coursesChosen.map((course) => {
        return { ...course, selected: false };
      })
    );
  };
  const handleDropStage = (e, index) => {
    e.preventDefault();
    const course = coursesChosen.filter((course, idx) => idx === index)[0];
    setDropStaged([...dropStaged, course]);
    setCoursesChosen(
      coursesChosen.map((course, idx) => {
        if (idx === index) {
          return { ...course, selected: true };
        } else return course;
      })
    );
  };
  return (
    <>
      <Navbar key="lg" bg="dark" variant="dark" expand={"md"} className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={{ fontSize: "31px" }}>
            CMS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${"md"}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${"md"}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${"md"}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${"md"}`}>
                CMS
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link onClick={() => dispatch(logoutUser())}>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {!registration ? (
        <h1 className="text-center">Course registration is closed</h1>
      ) : (
        <div className="container">
          {coursesChosen?.length === 0 && (
            <h1 className="py-2">No Courses chosen yet for current semester</h1>
          )}
          {coursesChosen?.length > 0 && (
            <>
              <h2 className="pt-2">Courses Selected for current Semester</h2>
              <p className="text-danger">
                Select at least 13 credits before registration closes
              </p>
              <Card className="shadow">
                <Card.Body>
                  {coursesChosen?.map((course, index) => (
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
                            Type: {numToType[course.typeCourse]}
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
                          onClick={(e) => handleDropStage(e, index)}
                          disabled={course.selected}
                        >
                          Drop
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
                    Credits Registered:{" "}
                    {coursesChosen.reduce((acc, curr) => {
                      return acc + curr.credits;
                    }, 0)}
                  </Card.Text>
                  <Button
                    className="my-auto mx-1"
                    style={{
                      float: "right",
                      display: "inline-block",
                    }}
                    onClick={(e) => cancelChanges(e)}
                    disabled={dropStaged.length === 0}
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
                      dispatch(dropCourses(dropStaged));
                    }}
                    disabled={dropStaged.length === 0}
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
                    {errors.registered ? errors.registered : ""}
                  </Card.Text>
                </Card.Body>
              </Card>
            </>
          )}
          <br />
          <br />
          <hr />
          <h2 className="py-2">Courses Available</h2>
          <CourseList />
        </div>
      )}
    </>
  );
}
