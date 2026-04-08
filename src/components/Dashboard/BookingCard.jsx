import { Card, Button, Badge } from "react-bootstrap";
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";

const BookingCard = ({ booking, isCancelled, onCancel, onPayNow }) => {
  const status = isCancelled ? "Cancelled" : booking.status || "Pending";
  const totalPrice = booking.totalPrice ?? booking.grandTotal ?? booking.price ?? 0;
  const persons = booking.totalPerson ?? booking.people ?? 1;
  const dateValue = booking.tripDate || booking.date || "TBD";

  return (
    <Card className="dashboard-booking-card shadow-sm">
      <Card.Body>
        <div className="booking-card-heading">
          <div>
            <Card.Title>{booking.tripName || "Unknown Trip"}</Card.Title>
            <div className="booking-card-subtitle">
              <FiMapPin className="booking-icon" />
              <span>{booking.destination || booking.tripDestination || "Unknown destination"}</span>
            </div>
          </div>
          <Badge pill bg={status === "Cancelled" ? "danger" : status === "Confirmed" ? "success" : "warning"}>
            {status}
          </Badge>
        </div>

        <div className="booking-card-grid">
          <div className="booking-detail">
            <FiCalendar className="detail-icon" />
            <div>
              <small>Date</small>
              <p>{dateValue}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiUsers className="detail-icon" />
            <div>
              <small>Persons</small>
              <p>{persons}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiDollarSign className="detail-icon" />
            <div>
              <small>Total Price</small>
              <p>₹{Number(totalPrice).toLocaleString()}</p>
            </div>
          </div>
          <div className="booking-detail">
            <FiClock className="detail-icon" />
            <div>
              <small>Booked On</small>
              <p>{booking.createdAt || booking.bookedAt || "—"}</p>
            </div>
          </div>
        </div>

        <div className="booking-card-actions">
          <Button
            variant={isCancelled ? "secondary" : "outline-danger"}
            onClick={() => onCancel(booking.id)}
            disabled={isCancelled}
          >
            {isCancelled ? "Cancelled" : "Cancel Booking"}
          </Button>
          <Button
            variant="primary"
            onClick={() => onPayNow(booking.id)}
            className="btn-pay-now"
          >
            Pay Now
            <FiArrowRight className="ms-2" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;
