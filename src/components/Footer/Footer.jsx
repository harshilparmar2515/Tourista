import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Destinations", href: "/destinations" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const companyLinks = [
    { name: "Terms & Conditions", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Refund Policy", href: "#" },
    { name: "FAQ", href: "#" },
  ];

  const destinations = [
    { name: "Paris", href: "#" },
    { name: "Tokyo", href: "#" },
    { name: "Dubai", href: "#" },
    { name: "New York", href: "#" },
    { name: "Bali", href: "#" },
    { name: "Santorini", href: "#" },
  ];

  return (
    <footer className="footer-modern">
      {/* Main Footer Content */}
      <section className="footer-content">
        <Container>
          <Row className="footer-columns">
            {/* Brand Column */}
            <Col lg={3} md={6} sm={12} className="footer-col">
              <div className="footer-brand">
                <h5 className="footer-title">
                  <span className="brand-emoji">✈️</span> Tourista
                </h5>
                <p className="footer-description">
                  Discover the world with Tourista. We help you plan your
                  perfect travel experience with handpicked destinations and
                  exclusive deals.
                </p>

                {/* Social Icons */}
                <div className="social-icons">
                  <a href="#facebook" className="social-icon" title="Facebook">
                    <FiFacebook />
                  </a>

                  <a href="#twitter" className="social-icon" title="Twitter">
                    <FiTwitter />
                  </a>

                  <a
                    href="https://www.instagram.com/_harshil_1290/"
                    className="social-icon"
                    title="Instagram"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiInstagram />
                  </a>

                  {/* ✅ FIXED LINKEDIN */}
                  <a
                    href="https://www.linkedin.com/in/harshil121"
                    className="social-icon"
                    title="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FiLinkedin />
                  </a>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Quick Links</h6>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Destinations */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Top Destinations</h6>
              <ul className="footer-links">
                {destinations.map((dest, index) => (
                  <li key={index}>
                    <a href={dest.href}>{dest.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Company */}
            <Col lg={2} md={6} sm={12} className="footer-col">
              <h6 className="footer-heading">Company</h6>
              <ul className="footer-links">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact Info */}
            <Col lg={3} md={12} sm={12} className="footer-col">
              <h6 className="footer-heading">Contact Us</h6>

              <div className="contact-info">
                <a href="tel:+919427819675" className="contact-item">
                  <FiPhone className="contact-icon" />
                  <span>+91 9427819675</span>
                </a>

                <a
                  href="mailto:harshilparmar2515@gmail.com"
                  className="contact-item"
                >
                  <FiMail className="contact-icon" />
                  <span>harshilparmar2515@gmail.com</span>
                </a>

                <div className="contact-item">
                  <FiMapPin className="contact-icon" />
                  <span>Bhavnagar, Gujarat</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="footer-copyright">
                &copy; {currentYear} Tourista. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="footer-credit">
                Made with <span className="heart">❤️</span> for travelers
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;