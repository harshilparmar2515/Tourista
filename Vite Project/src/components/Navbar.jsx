import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { auth } from "../Firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from "react";

function NavScrollExample() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("Logged out");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>

        <Navbar.Brand as={Link} to="/">
          <img src="public/logo.svg" alt="logo" style={{ width: "40px", marginRight: "10px" }} />
          Tourista
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>

          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
          </Nav>

          {user ? (
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Nav.Link as={Link} to="/auth">
              Login
            </Nav.Link>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
