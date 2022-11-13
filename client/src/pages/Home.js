import React, { useEffect } from "react";
//bootstrap
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
//redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, logoutUser } from "../redux/userActions";
import { Link } from "react-router-dom";
import Course from "../components/Course";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <>
      <Navbar key="lg" bg="dark" variant="dark" expand={"md"} className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
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
        <h1 className="py-2">Welcome {user.username}</h1>
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
        {user.courses.map((course, index) => (
          <Course key={index} course={course} />
        ))}
      </div>
    </>
  );
}
