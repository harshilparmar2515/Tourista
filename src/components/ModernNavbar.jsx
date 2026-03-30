import { Container, Nav, Navbar, Button, Dropdown, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  FiLogOut,
  FiUser,
  FiMenu,
  FiHome,
  FiInfo,
  FiMapPin,
  FiLogIn,
} from "react-icons/fi";
import "./navbar.css";

function ModernNavbar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Scroll event listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      showToast("Logged out successfully ✓", "success");
    } catch (error) {
      showToast("Logout failed", "danger");
    }
  };

  const showToast = (message, type = "info") => {
    // This will be replaced with toast notification
    alert(message);
  };

  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar-modern ${scrolled ? "scrolled" : ""}`}
        sticky="top"
      >
        <Container fluid className="px-4">
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
            <img src="logo.svg" alt="logoo" height={45} />
            <span className="brand-text">Tourista</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links */}
            <Nav className="mx-auto nav-links">
              <Nav.Link as={Link} to="/" className="nav-link-modern">
                <FiHome className="nav-icon" />
                <span>Home</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="nav-link-modern">
                <FiInfo className="nav-icon" />
                <span>ExploreTrips</span>
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-modern">
                <FiMapPin className="nav-icon" />
                <span>Contact</span>
              </Nav.Link>
            </Nav>

            {/* Auth Actions */}
            <Nav className="ms-auto nav-auth">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/my-bookings" className="nav-link-modern">
                    My Bookings
                  </Nav.Link>

                  <Dropdown>
                    <Dropdown.Toggle
                      as="button"
                      className="btn-user-avatar"
                      id="dropdown-user"
                    >
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="User"
                          className="avatar-img"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          <FiUser />
                        </div>
                      )}
                      <span className="user-email">{user.email?.split("@")[0]}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item disabled>
                        <strong>{user.email}</strong>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item as={Link} to="/my-bookings">
                        📌 My Bookings
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="text-danger">
                        <FiLogOut className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <Button
                  as={Link}
                  to="/auth"
                  className="btn-login"
                >
                  <FiLogIn className="me-2" />
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default ModernNavbar;
