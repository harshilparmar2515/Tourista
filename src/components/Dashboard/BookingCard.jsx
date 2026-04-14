import { Card, Button, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

// Helper function to format Firestore timestamps
const formatTimestamp = (value) => {
  if (!value) return "—";
  
  // Handle Firestore Timestamp object {seconds, nanoseconds}
  if (value?.seconds) {
    try {
      const date = new Date(value.seconds * 1000);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (e) {
      return "—";
    }
  }
  
  // Handle Date object
  if (value instanceof Date) {
    return value.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  
  // Handle string
  if (typeof value === "string") {
    try {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      }
    } catch (e) {}
  }
  
  return "—";
};

const BookingCard = ({ booking, isCancelled, onCancel, onPayNow }) => {
  const status = isCancelled ? "Cancelled" : booking.status || "Pending";
  const totalPrice = booking.totalPrice ?? booking.grandTotal ?? booking.price ?? 0;
  const persons = booking.totalPerson ?? booking.people ?? 1;
  const dateValue = formatTimestamp(booking.tripDate || booking.date) || "TBD";
  const bookedOn = formatTimestamp(booking.createdAt || booking.bookedAt || booking.bookedDate);
  const imageUrl = booking.imageUrl || booking.previewImage || booking.photoUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60";

  const timelineSteps = [
    { label: "Booked", active: true },
    { label: "In progress", active: status === "Confirmed" || status === "Cancelled" },
    { label: "Complete", active: status === "Confirmed" },
  ];

  const isPaid = status === "Confirmed";
  const payDisabled = isCancelled || isPaid;

  return (
    <Card className="dashboard-booking-card shadow-sm">
      <div className="booking-card-image" style={{ backgroundImage: `url(${imageUrl})` }} />
      <Card.Body>
        <div className="booking-card-heading">
          <div>
            <Card.Title>{booking.tripName || "Unknown Trip"}</Card.Title>
            <div className="booking-card-subtitle">
              <FiMapPin className="booking-icon" />
              <span>{booking.destination || booking.tripDestination || "Unknown destination"}</span>
            </div>
          </div>
          <Badge
            pill
            bg={
              status === "Cancelled"
                ? "danger"
                : status === "Confirmed"
                ? "success"
                : "warning"
            }
            className="booking-status-badge"
          >
            {status}
          </Badge>
        </div>

        <div className="booking-card-grid">
          <div className="booking-detail">
            <FiCalendar className="detail-icon" />
            <div>
              <small>Travel date</small>
              <p>{dateValue}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiUsers className="detail-icon" />
            <div>
              <small>Passengers</small>
              <p>{persons}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiDollarSign className="detail-icon" />
            <div>
              <small>Total</small>
              <p>₹{Number(totalPrice).toLocaleString()}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiClock className="detail-icon" />
            <div>
              <small>Booked on</small>
              <p>{bookedOn}</p>
            </div>
          </div>
        </div>

        <div className="booking-timeline">
          {timelineSteps.map((step) => (
            <div key={step.label} className={`timeline-item ${step.active ? "active" : ""}`}>
              <span />
              <small>{step.label}</small>
            </div>
          ))}
        </div>

        <div className="booking-card-actions">
          <Button
            variant={isCancelled ? "secondary" : "outline-danger"}
            onClick={() => onCancel(booking.id)}
            disabled={isCancelled}
          >
            {isCancelled ? "Cancelled" : "Cancel Booking"}
          </Button>
          {payDisabled ? (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {isCancelled
                    ? "Cancelled bookings cannot be paid"
                    : "This booking is already confirmed."}
                </Tooltip>
              }
            >
              <span className="d-inline-block">
                <Button
                  variant="primary"
                  disabled
                  className="btn-pay-now"
                >
                  Pay Now
                  <FiArrowRight className="ms-2" />
                </Button>
              </span>
            </OverlayTrigger>
          ) : (
            <Button
              variant="primary"
              onClick={() => onPayNow(booking)}
              className="btn-pay-now"
            >
              Pay Now
              <FiArrowRight className="ms-2" />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;
