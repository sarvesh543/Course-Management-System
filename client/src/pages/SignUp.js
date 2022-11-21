import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../components/Loading";
//redux
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, signupUser } from "../redux/userActions";

export default function SignUp() {
  const dispatch = useDispatch();
  const { loading, errors } = useSelector((state) => state.user);

  const [username, setUsername] = useState("");
  const [rollno, setRollno] = useState("");
  const [branch, setBranch] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${"md"}`}>
                CMS
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link as={Link} to="/">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <div className="container item-center">
        <h1 className="text-center py-3">Sign Up</h1>
        <hr className="opacity-100" />
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(
              signupUser({
                username,
                password,
                confirmPassword,
                rollno,
                email,
                branch,
              })
            );
          }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Text className="text-danger">
              {errors.username ? errors.username : ""}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Roll No</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter Roll No"
              value={rollno}
              onChange={(e) => setRollno(e.target.value)}
            />
            <Form.Text className="text-danger">
              {errors.rollno ? errors.rollno : ""}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-danger">
              {errors.email ? errors.email : ""}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Branch</Form.Label>
            <Form.Select onChange={(e) => setBranch(e.target.value)} required>
              <option value="CSE">CS</option>
              <option value="EE">EE</option>
              <option value="DSE">DSE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="BE">BE</option>
              <option value="EP">EP</option>
            </Form.Select>
            <Form.Text className="text-danger">
              {errors.branch ? errors.branch : ""}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Text className="text-danger">
              {errors.password ? errors.password : ""}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Form.Text className="text-danger">
              {errors.confirmPassword ? errors.confirmPassword : ""}
            </Form.Text>
          </Form.Group>

          <div className="container d-flex flex-column justify-content-center">
            <Form.Text className="text-danger pb-1 text-center">
              {errors.general ? errors.general : ""}
            </Form.Text>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Loading /> : "Sign Up"}
            </Button>
            <p className="text-center">
              Already have an account? Login <Link to="/login">here</Link>
            </p>
          </div>
          <hr className="opacity-100" />
        </Form>
      </div>
    </>
  );
}
