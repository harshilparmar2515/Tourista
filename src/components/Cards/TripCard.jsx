import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiArrowRight,
  FiTrendingUp,
} from "react-icons/fi";
import "./tripCard.css";

const TripCard = ({ trip, variant = "default" }) => {
  // Format price with commas
  const formattedPrice = `₹${trip.price?.toLocaleString() || "0"}`;

  // Extract rating number from string (e.g., "4.8 ⭐" -> 4.8)
  const rating = parseFloat(trip.rating?.toString().split(" ")[0]) || 0;

  // Determine difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "danger";
      default:
        return "info";
    }
  };

  return (
    <Card className={`trip-card trip-card-${variant}`}>
      {/* Image Container with Overlay */}
      <div className="trip-card-image-wrapper">
        <Card.Img
          variant="top"
          src={trip.image}
          alt={trip.name}
          className="trip-card-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=Trip+Image";
          }}
        />

        {/* Badges Overlay */}
        <div className="trip-card-badges">
          <Badge bg="danger" className="badge-price">
            {formattedPrice}
          </Badge>
          <Badge bg="warning" className="badge-duration">
            <FiClock className="me-1" />
            {trip.duration}
          </Badge>
        </div>

        {/* Difficulty Badge */}
        {trip.difficulty && (
          <Badge
            bg={getDifficultyColor(trip.difficulty)}
            className="badge-difficulty"
          >
            {trip.difficulty}
          </Badge>
        )}

        {/* Rating Stars */}
        <div className="trip-card-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={i < Math.floor(rating) ? "filled" : ""}
              />
            ))}
          </div>
          <span className="rating-text">{trip.rating}</span>
        </div>
      </div>

      {/* Card Body */}
      <Card.Body className="trip-card-body">
        {/* Title */}
        <Card.Title className="trip-card-title">{trip.name}</Card.Title>

        {/* Destination */}
        <div className="trip-card-destination">
          <FiMapPin className="destination-icon" />
          <span>{trip.destination}</span>
        </div>

        {/* Overview */}
        <Card.Text className="trip-card-overview">
          {trip.overview}
        </Card.Text>

        {/* Highlights Preview */}
        {trip.highlights && trip.highlights.length > 0 && (
          <div className="trip-card-highlights">
            <small className="highlights-label">Highlights:</small>
            <div className="highlights-list">
              {trip.highlights.slice(0, 2).map((highlight, idx) => (
                <span key={idx} className="highlight-tag">
                  {highlight}
                </span>
              ))}
              {trip.highlights.length > 2 && (
                <span className="highlight-tag more">
                  +{trip.highlights.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>

      {/* Card Footer with CTA Button */}
      <Card.Footer className="trip-card-footer bg-transparent">
        <Button
          as={Link}
          to={`/trip/${trip.id}`}
          className="btn-explore"
        >
          <span>Explore Trip</span>
          <FiArrowRight className="btn-icon" />
        </Button>

        {/* Compare Button (Optional) */}
        <button className="btn-compare" title="Add to compare">
          <FiTrendingUp />
        </button>
      </Card.Footer>
    </Card>
  );
};

export default TripCard;
