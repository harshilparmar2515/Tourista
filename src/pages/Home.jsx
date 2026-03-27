import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Carousel,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiArrowRight,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { trips } from "../data/tripData";
import TripCard from "../components/Cards/TripCard";
import "./home.css";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate ;
const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredTrips, setFeaturedTrips] = useState([]);

  useEffect(() => {
    // Get 6 featured trips (highest rated)
    const featured = trips
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 6);
    setFeaturedTrips(featured);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results
    window.location.href = `/search?q=${searchQuery}`;
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Travel Blogger",
      image: "https://i.pravatar.cc/150?img=1",
      text: "Tourista made planning my dream vacation so easy! The curated destinations and competitive prices are unbeatable.",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Adventure Enthusiast",
      image: "https://i.pravatar.cc/150?img=2",
      text: "The best travel booking platform I've used. Great UI, excellent customer support, and amazing deals!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Luxury Traveler",
      image: "https://i.pravatar.cc/150?img=3",
      text: "Tourista offers premium experiences at affordable prices. Highly recommended for anyone looking for quality travel.",
      rating: 5,
    },
  ];

  const stats = [
    { icon: FiMapPin, count: "250+", label: "Destinations" },
    { icon: FiUsers, count: "50K+", label: "Happy Travelers" },
    { icon: FiAward, count: "4.8", label: "Avg Rating" },
    { icon: FiTrendingUp, count: "1000+", label: "Curated Trips" },
  ];

  return (
    <div className="home-page">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="hero-section">
        <div className="hero-background">
          <video
            autoPlay
            muted
            loop
            className="hero-video"
          >
            <source
              src="https://www.pexels.com/download/video/5735794/"
              type="video/mp4"
            />
          </video>
          <div className="hero-overlay"></div>
        </div>

        <Container className="hero-content">
          <div className="hero-text animate-fade-in-up">
            <h1 className="hero-title">Explore the World Beyond Limits</h1>
            <p className="hero-subtitle">
              Discover breathtaking destinations, hidden gems, and unforgettable
              experiences. Your next adventure begins here.
            </p>

            {/* Search Bar */}
            <Form onSubmit={handleSearchSubmit} className="search-form">
              <Form.Group className="search-group">
                <div className="search-input-wrapper">
                  <FiSearch className="search-icon" />
                  <Form.Control
                    type="text"
                    placeholder="Search destinations, tours, activities..."
                    className="search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="btn-search"
                  onClick={() => navigate("/about")}
                >
                  <span>Explore Trips</span>
                  <FiArrowRight />
                </Button>
              </Form.Group>

              {/* Filter Chips */}
              <div className="search-filters">
                <Link to="/trips" className="filter-chip">
                  <FiMapPin /> Popular Destinations
                </Link>
                <Link to="/trips" className="filter-chip">
                  <FiCalendar /> This Month
                </Link>
                <Link to="/trips" className="filter-chip">
                  <FiUsers /> Group Trips
                </Link>
              </div>
            </Form>
          </div>
        </Container>
      </section>

      {/* ============================================
          STATS SECTION
          ============================================ */}
      <section className="stats-section">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Col lg={3} md={6} sm={6} key={index}>
                  <div className="stat-card animate-fade-in">
                    <div className="stat-icon">
                      <Icon />
                    </div>
                    <h3 className="stat-count">{stat.count}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* ============================================
          FEATURED DESTINATIONS SECTION
          ============================================ */}
      <section className="featured-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">
              Handpicked travel experiences from around the world
            </p>
            <Button
              as={Link}
              to="/trips"
              className="btn-view-all"
            >
              View All Trips <FiArrowRight />
            </Button>
          </div>

          <Row className="trips-grid g-4">
            {featuredTrips.map((trip) => (
              <Col lg={12} md={6} sm={12} key={trip.id} className="animate-fade-in">
                <TripCard trip={trip} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============================================
          WHY CHOOSE US SECTION
          ============================================ */}
      <section className="why-us-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title text-white">Why Choose Tourista?</h2>
            <p className="section-subtitle text-light">
              We provide the best travel experiences with unmatched quality and value
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                icon: "✈️",
                title: "Best Deals",
                desc: "Competitive prices and exclusive discounts on all packages",
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                desc: "100% secure booking with verified partners and insurance",
              },
              {
                icon: "👥",
                title: "Expert Team",
                desc: "24/7 customer support from experienced travel experts",
              },
              {
                icon: "🎯",
                title: "Curated Tours",
                desc: "Hand-picked destinations and itineraries for unforgettable trips",
              },
              {
                icon: "💳",
                title: "Flexible Payment",
                desc: "Easy installment plans and multiple payment options",
              },
              {
                icon: "⭐",
                title: "Quality Assured",
                desc: "Highly rated experiences with 4.8+ average customer reviews",
              },
            ].map((feature, index) => (
              <Col lg={4} md={6} sm={12} key={index} className="animate-fade-in">
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-desc">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ============================================
          TESTIMONIALS SECTION
          ============================================ */}
      <section className="testimonials-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-subtitle">
              Real experiences from real travelers
            </p>
          </div>

          <Carousel className="testimonials-carousel" indicators={false} controls={true}>
            {testimonials.map((testimonial) => (
              <Carousel.Item key={testimonial.id} className="testimonial-item">
                <div className="testimonial-card animate-fade-in">
                  <div className="testimonial-stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>

                  <p className="testimonial-text">"{testimonial.text}"</p>

                  <div className="testimonial-author">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <h6 className="author-name">{testimonial.name}</h6>
                      <small className="author-role">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <Container className="cta-content">
          <Row className="align-items-center">
            <Col lg={6} className="animate-slide-in-left">
              <h2 className="cta-title">Ready for Your Next Adventure?</h2>
              <p className="cta-subtitle">
                Join thousands of travelers who have discovered their perfect
                destination with Tourista. Start planning your journey today.
              </p>

              <div className="cta-buttons">
                <Button as={Link} to="/trips" className="btn-primary-large">
                  Explore Destinations
                </Button>
                <Button as={Link} to="/contact" className="btn-secondary-large">
                  Contact Us
                </Button>
              </div>
            </Col>

            <Col lg={6} className="animate-slide-in-right">
              <div className="cta-form-card">
                <h4 className="form-title">Subscribe to Our Newsletter</h4>
                <p className="form-subtitle">
                  Get exclusive deals and travel tips delivered to your inbox
                </p>

                <Form className="newsletter-form">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </Form.Group>

                  <Button type="submit" className="btn-subscribe">
                    <FiMail /> Subscribe Now
                  </Button>
                </Form>

                <p className="form-disclaimer">
                  We respect your privacy. No spam, just great travel content.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ============================================
          FAQ SECTION
          ============================================ */}
      <section className="faq-section">
        <Container>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Find answers to common questions about our services
            </p>
          </div>

          {/* Simple FAQ Cards */}
          <Row className="g-4">
            {[
              {
                q: "How do I book a trip?",
                a: "Browse our destinations, click on your preferred trip, select dates, and complete the booking process. It's that simple!",
              },
              {
                q: "Can I cancel my booking?",
                a: "Yes! You can cancel up to 7 days before the trip for a full refund. Terms and conditions apply.",
              },
              {
                q: "Are payment plans available?",
                a: "Absolutely! We offer flexible payment plans. You can pay in 3, 6, or 12 installments.",
              },
              {
                q: "Do you provide travel insurance?",
                a: "Yes, travel insurance is included with all bookings. Additional coverage options are also available.",
              },
            ].map((faq, index) => (
              <Col lg={6} key={index} className="animate-fade-in">
                <Card className="faq-card">
                  <Card.Body>
                    <h6 className="faq-question">{faq.q}</h6>
                    <p className="faq-answer">{faq.a}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;