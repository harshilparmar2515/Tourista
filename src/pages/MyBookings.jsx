import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../components/context/AuthContext";
import { db } from "../Firebase/Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Container, Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import { FiTrash2, FiChevronRight, FiCheckCircle } from "react-icons/fi";
import { useToast } from "../components/ToastContext";
import "./myBookings.css";

const MyBookings = () => {
  const { user } = useContext(authContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const q = query(
          collection(db, "booking"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        const userBookings = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setBookings(userBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        addToast("Unable to load bookings. Try again later.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, addToast]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setRemoving(bookingId);
    try {
      await deleteDoc(doc(db, "MyBookings", bookingId));
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      addToast("Booking cancelled successfully.", "success");
    } catch (error) {
      console.error("Cancel booking failed:", error);
      addToast("Failed to cancel booking. Please try again.", "error");
    } finally {
      setRemoving(null);
    }
  };

  return (
    <Container className="mybookings-page">
      <h1 className="mybookings-title">My Bookings</h1>
      <p className="mybookings-subtitle">Manage your upcoming trips and track your past travels.</p>

      {loading ? (
        <div className="mybookings-loading">
          <Spinner animation="border" variant="primary" />
          <span>Loading your bookings...</span>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mybookings-empty">
          <FiCheckCircle className="mybookings-empty-icon" />
          <h3>No bookings yet</h3>
          <p>Browse our trips and book your next adventure.</p>
          <Button onClick={() => navigate("/trips")} className="btn-explore-trips">
            Explore Trips <FiChevronRight />
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {bookings.map((booking) => (
            <Col lg={6} key={booking.id}>
              <Card className="booking-card shadow-sm">
                <Card.Body>
                  <div className="booking-card-row">
                    <div>
                      <Card.Title>{booking.tripName}</Card.Title>
                      <Card.Subtitle className="text-muted">
                        {booking.tripDestination} - {booking.tripDate}
                      </Card.Subtitle>
                    </div>
                    <Badge pill bg="primary" className="booking-status">
                      Confirmed
                    </Badge>
                  </div>

                  <div className="booking-details mt-3">
                    <div className="detail-item">
                      <strong>Traveler:</strong> {booking.name}
                    </div>
                    <div className="detail-item">
                      <strong>Persons:</strong> {booking.totalPerson}
                    </div>
                    <div className="detail-item">
                      <strong>Total Paid:</strong> ₹{booking.grandTotal?.toLocaleString()}
                    </div>
                    <div className="detail-item">
                      <strong>Contact:</strong> {booking.email} | {booking.phone}
                    </div>
                  </div>

                  <div className="booking-actions mt-3">
                    <Button
                      variant="outline-danger"
                      onClick={() => cancelBooking(booking.id)}
                      disabled={removing === booking.id}
                    >
                      {removing === booking.id ? "Cancelling..." : <><FiTrash2 /> Cancel</>}
                    </Button>
                    <Button variant="primary" onClick={() => navigate(`/trip/${booking.tripId}`)}>
                      View Trip
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;