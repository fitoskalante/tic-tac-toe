import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";

export default function NavbarApp(props) {
  return (
    <Navbar bg="danger" variant="dark" sticky="top" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto ml-5">
          {props.currentUser ? (
            <Nav.Link href="#home">Welcome {props.currentUser}</Nav.Link>
          ) : (
            <Nav.Link href="#home">Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
      <Navbar.Brand href="#home">
        <strong>#Gato</strong>
      </Navbar.Brand>
    </Navbar>
  );
}
