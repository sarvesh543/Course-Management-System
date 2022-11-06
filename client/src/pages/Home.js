import React, { useEffect, useState } from "react";
//bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Loading from "../components/Loading";
//redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, loadNotes, logoutUser } from "../redux/userActions";
import { Link } from "react-router-dom";

export default function Home() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  
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
                <Nav.Link onClick={() => dispatch(logoutUser())}>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <div className="container">
        <h1 className="text-center py-2">{user.username}</h1>
        <hr className="opacity-100" />
        
      </div>
    </>
  );
}
