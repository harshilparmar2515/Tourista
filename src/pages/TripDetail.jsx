import React, { useState, useEffect } from "react";
import { Container, Row, Col, Accordion, Badge, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiShare2,
  FiHeart,
  FiCalendar,
  FiUsers,
  FiFilter,
  FiTrendingUp,
} from "react-icons/fi";
import { trips } from "../data/tripData";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import "./tripDetail.css";

const TripDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === parseInt(id));
  const [favorited, setFavorited] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!trip) {
    return (
      <div className="trip-not-found">
        <Container>
          <div className="not-found-content">
            <h1>🏝️ Trip Not Found</h1>
            <p>Sorry, we couldn't find the trip you're looking for.</p>
            <Button onClick={() => navigate("/trips")} className="btn-back-to-trips">
              <FiArrowLeft /> Back to All Trips
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const rating = parseFloat(trip.rating);

  const handleBook = () => {
    if (!user) {
      navigate("/Auth", {
        state: { from: `/booking/${trip.id}` }
      });
    } else {
      navigate(`/booking/${trip.id}`);
    }
  };

  return (
    <div className="trip-detail-page">
      {/* Hero Section */}
      <section className="trip-hero">
        <img src={trip.image} alt={trip.name} className="trip-hero-image" />
        <div className="trip-hero-overlay"></div>

        <Container className="trip-hero-content">
          <Button
            variant="link"
            className="btn-hero-back"
            onClick={() => navigate("/trips")}
          >
            <FiArrowLeft /> Back
          </Button>

          <div className="trip-hero-text">
            <h1 className="trip-hero-title">{trip.name}</h1>
            <p className="trip-hero-destination">
              <FiMapPin /> {trip.destination}
            </p>
          </div>

          <div className="trip-hero-actions">
            <Button
              className={`btn-favorite ${favorited ? "active" : ""}`}
              onClick={() => setFavorited(!favorited)}
            >
              <FiHeart /> {favorited ? "Saved" : "Save"}
            </Button>
            <Button className="btn-share">
              <FiShare2 /> Share
            </Button>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="trip-main">
        <Container>
          <Row className="g-4">
            {/* Left Column - Content */}
            <Col lg={8} md={12}>
              {/* Quick Info Cards */}
              <div className="quick-info">
                <div className="info-card">
                  <div className="info-icon">
                    <FiClock />
                  </div>
                  <div className="info-content">
                    <p className="info-label">Duration</p>
                    <p className="info-value">{trip.duration}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FiFilter />
                  </div>
                  <div className="info-content">
                    <p className="info-label">Difficulty</p>
                    <p className="info-value">{trip.difficulty}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FiStar />
                  </div>
                  <div className="info-content">
                    <p className="info-label">Rating</p>
                    <p className="info-value">{trip.rating}</p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">
                    <FiTrendingUp />
                  </div>
                  <div className="info-content">
                    <p className="info-label">Highlights</p>
                    <p className="info-value">{trip.highlights?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* Overview Section */}
              <section className="trip-section">
                <h2 className="section-heading">Overview</h2>
                <p className="overview-text">{trip.overview}</p>
              </section>

              {/* Highlights Section */}
              {trip.highlights && trip.highlights.length > 0 && (
                <section className="trip-section">
                  <h2 className="section-heading">Highlights</h2>
                  <div className="highlights-grid">
                    {trip.highlights.map((highlight, idx) => (
                      <div key={idx} className="highlight-item">
                        <FiCheckCircle className="highlight-icon" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Itinerary Section */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <section className="trip-section">
                  <h2 className="section-heading">Itinerary</h2>
                  <Accordion className="itinerary-accordion">
                    {trip.itinerary.map((day, idx) => (
                      <Accordion.Item eventKey={idx.toString()} key={idx}>
                        <Accordion.Header>
                          <div className="accordion-custom-header">
                            <span className="day-badge">{day.day}</span>
                            <span className="day-title">{day.title}</span>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <p className="day-description">{day.description}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </section>
              )}

              {/* Inclusions & Exclusions */}
              <section className="trip-section">
                <Row className="g-4">
                  <Col md={6}>
                    <div className="inclusion-box">
                      <h4 className="inclusion-title">✅ What's Included</h4>
                      <ul className="inclusion-list">
                        {trip.inclusions?.map((item, idx) => (
                          <li key={idx}>
                            <FiCheckCircle /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="exclusion-box">
                      <h4 className="exclusion-title">❌ What's Not Included</h4>
                      <ul className="exclusion-list">
                        {trip.exclusions?.map((item, idx) => (
                          <li key={idx}>
                            <span className="x-icon">✕</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </section>

              {/* Best Time to Visit */}
              {trip.bestTimeToVisit && (
                <section className="trip-section">
                  <h2 className="section-heading">Best Time to Visit</h2>
                  <div className="best-time-card">
                    <FiCalendar className="best-time-icon" />
                    <div>
                      <p className="best-time-label">Recommended Season</p>
                      <p className="best-time-value">{trip.bestTimeToVisit}</p>
                    </div>
                  </div>
                </section>
              )}
            </Col>

            {/* Right Column - Booking Card (Sticky) */}
            <Col lg={4} md={12}>
              <div className="booking-card-sticky">
                <div className="booking-card">
                  {/* Price Section */}
                  <div className="price-section">
                    <p className="price-label">Starting from</p>
                    <h3 className="price-value">₹{trip.price?.toLocaleString()}</h3>
                    <p className="price-note">per person</p>
                  </div>

                  {/* Rating */}
                  <div className="rating-section">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < Math.floor(rating) ? "filled" : ""}
                        />
                      ))}
                    </div>
                    <span className="rating-value">{trip.rating}</span>
                  </div>

                  {/* Details */}
                  <div className="details-list">
                    <div className="detail-row">
                      <span className="detail-label">
                        <FiClock /> Duration
                      </span>
                      <span className="detail-value">{trip.duration}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <FiMapPin /> Location
                      </span>
                      <span className="detail-value">{trip.destination}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">
                        <FiFilter /> Level
                      </span>
                      <Badge bg="success">{trip.difficulty}</Badge>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="booking-buttons">
                    <Button
                      className="btn-book-now"
                      onClick={handleBook}
                    >
                      Book Now
                      <FiArrowRight />
                    </Button>
                    <Button className="btn-inquiry">
                      <FiUsers /> Send Inquiry
                    </Button>
                  </div>

                  {/* Trust Badge */}
                  <div className="trust-section">
                    <p className="trust-text">
                      ✓ Verified by 50K+ travelers
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Similar Trips Section */}
      <section className="similar-trips">
        <Container>
          <h2 className="section-title">More Adventures Await</h2>
          <p className="section-subtitle">
            Check out these similar trips you might love
          </p>

          <Row className="g-4 mt-4">
            {trips.slice(0, 3).map((similarTrip) => (
              <Col lg={4} md={6} sm={12} key={similarTrip.id}>
                <div
                  className="similar-trip-card"
                  onClick={() => navigate(`/trip/${similarTrip.id}`)}
                >
                  <img src={similarTrip.image} alt={similarTrip.name} />
                  <div className="card-content">
                    <h5>{similarTrip.name}</h5>
                    <p>{similarTrip.destination}</p>
                    <div className="card-footer">
                      <span className="rating">⭐ {similarTrip.rating}</span>
                      <span className="price">₹{similarTrip.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default TripDetailPage;