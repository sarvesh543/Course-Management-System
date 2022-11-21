import React, { useEffect, useState } from "react";
//bootstrap
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
//redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, logoutUser, getUser } from "../redux/userActions";
import { Link } from "react-router-dom";
import Course from "../components/Course";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUser(localStorage.getItem("token")));
  }, [dispatch]);
  const [semester, setSemester] = useState("all");

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

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
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-${"md"}`}
                style={{ fontSize: "1px!important" }}
              >
                CMS
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/adddrop">
                  Add Drop
                </Nav.Link>
                <Nav.Link onClick={() => dispatch(logoutUser())}>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="container">
        <h1 className="py-2" style={{ textAlign: "center" }}>
          Welcome {user.username}!
        </h1>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>Roll No: {user.rollno}</ListGroup.Item>
            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
            <ListGroup.Item>Semester: {user.semester}</ListGroup.Item>
            <ListGroup.Item>Branch: {user.branch}</ListGroup.Item>
          </ListGroup>
        </Card>
        <br />
        <h1 className="py-2">My courses</h1>
        <h4>Semester</h4>
        <Form.Select
          onChange={(e) => {
            setSemester(e.target.value);
          }}
          value={semester}
        >
          <option value={"all"}>All</option>
          {Array.from({ length: parseInt(user.semester) }, (_, index) => {
            return (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            );
          })}
        </Form.Select>
        {user.courses
          ?.filter((course) => {
            if (semester === "all") return true;
            else return course.semester === parseInt(semester);
          })
          .map((course, index) => (
            <Course key={index} course={course} />
          ))}
        {user.courses?.filter((course) => {
          if (semester === "all") return true;
          else return course.semester === parseInt(semester);
        }).length === 0 && (
          <h3 className="text-center">Nothing to show here</h3>
        )}
      </div>
    </>
  );
}
