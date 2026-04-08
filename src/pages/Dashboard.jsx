import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { authContext } from "../components/context/AuthContext";
import { db } from "../Firebase/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  FiUser,
  FiHeart,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiFilter,
  FiMapPin,
  FiCheckCircle,
} from "react-icons/fi";
import BookingCard from "../components/Dashboard/BookingCard";
import StatusCard from "../components/Dashboard/StatusCard";
import "./dashboard.css";

const statusOptions = ["All", "Pending", "Confirmed", "Cancelled"];

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(authContext);
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [cancelledIds, setCancelledIds] = useState(new Set());
  const [payMessage, setPayMessage] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setError("");
      setLoading(true);

      try {
        const bookingsQuery = query(
          collection(db, "MyBookings"),
          where("userId", "==", user.uid)
        );
        const wishlistQuery = query(
          collection(db, "Wishlist"),
          where("userId", "==", user.uid)
        );

        const [bookingsSnapshot, wishlistSnapshot] = await Promise.all([
          getDocs(bookingsQuery),
          getDocs(wishlistQuery),
        ]);

        const userBookings = bookingsSnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        const favorites = wishlistSnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setBookings(userBookings);
        setWishlist(favorites);
      } catch (fetchError) {
        console.error("Dashboard load failed:", fetchError);
        setError("Unable to load your dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadDashboard();
    }
  }, [user, authLoading]);

  const displayedName = user?.displayName || user?.email?.split("@")[0] || "Traveler";

  const dashboardBookings = useMemo(() => {
    const normalized = bookings.map((booking) => ({
      ...booking,
      isCancelled: cancelledIds.has(booking.id),
      status: cancelledIds.has(booking.id)
        ? "Cancelled"
        : booking.status || "Pending",
    }));

    const filtered = normalized.filter((booking) => {
      if (statusFilter === "All") {
        return true;
      }
      return booking.status === statusFilter;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        const aPrice = Number(a.totalPrice ?? a.grandTotal ?? a.price ?? 0);
        const bPrice = Number(b.totalPrice ?? b.grandTotal ?? b.price ?? 0);
        return sortDirection === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }

      const aDate = new Date(a.tripDate || a.date || "");
      const bDate = new Date(b.tripDate || b.date || "");
      if (Number.isNaN(aDate.getTime()) || Number.isNaN(bDate.getTime())) {
        return 0;
      }
      return sortDirection === "asc"
        ? aDate - bDate
        : bDate - aDate;
    });

    return sorted;
  }, [bookings, cancelledIds, sortBy, sortDirection, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { Pending: 0, Confirmed: 0, Cancelled: 0 };
    bookings.forEach((booking) => {
      if (cancelledIds.has(booking.id)) {
        counts.Cancelled += 1;
      } else {
        const status = booking.status || "Pending";
        counts[status] = (counts[status] ?? 0) + 1;
      }
    });
    return counts;
  }, [bookings, cancelledIds]);

  const handleCancel = (bookingId) => {
    setCancelledIds((prev) => new Set(prev).add(bookingId));
  };

  const handlePayNow = (bookingId) => {
    setPayMessage("Pay Now is coming soon. Stay tuned for secure checkout.");
    window.setTimeout(() => setPayMessage(""), 3200);
  };
  console.log("USER:", user?.uid);
console.log("BOOKINGS:", bookings);
  return (
    <Container className="dashboard-page py-4">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-overline">Travel dashboard</p>
          <h1>Welcome back, {displayedName}</h1>
          <p className="dashboard-intro">
            Track your bookings, wishlist, and booking status in one elegant place.
          </p>
        </div>

        <Card className="dashboard-profile-card shadow-sm">
          <div className="profile-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <div className="profile-placeholder">
                <FiUser />
              </div>
            )}
          </div>
          <div>
            <p className="profile-label">Signed in as</p>
            <h5>{displayedName}</h5>
            <p className="profile-email">{user?.email}</p>
          </div>
        </Card>
      </div>

      <Row className="dashboard-grid">
        <Col xl={3} lg={4}>
          <Card className="dashboard-panel shadow-sm">
            <Card.Body>
              <div className="panel-heading">
                <h5>Quick overview</h5>
                <p>Essential account metrics at a glance.</p>
              </div>

              <div className="status-panel-list">
                <StatusCard
                  icon={<FiCalendar />}
                  label="Upcoming"
                  value={statusCounts.Pending}
                  accent="accent-soft"
                />
                <StatusCard
                  icon={<FiCheckCircle />}
                  label="Confirmed"
                  value={statusCounts.Confirmed}
                  accent="accent-primary"
                />
                <StatusCard
                  icon={<FiTrendingUp />}
                  label="Cancelled"
                  value={statusCounts.Cancelled}
                  accent="accent-danger"
                />
              </div>
            </Card.Body>
          </Card>

          <Card className="dashboard-panel shadow-sm wishlist-panel">
            <Card.Body>
              <div className="panel-heading">
                <h5>Wishlist</h5>
                <p>{wishlist.length} saved trip{wishlist.length === 1 ? "" : "s"}</p>
              </div>
              {wishlist.length > 0 ? (
                <ul className="wishlist-list">
                  {wishlist.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <FiHeart className="wishlist-icon" />
                      <span>{item.tripName || item.destination || "Favorite destination"}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state-card">
                  <p>No wishlist items yet.</p>
                  <Button variant="outline-primary" href="/trips">
                    Explore trips
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={9} lg={8}>
          <div className="dashboard-toolbar">
            <div className="toolbar-copy">
              <h5>Bookings</h5>
              <p>Sort and filter your trips by date or total price.</p>
            </div>
            <div className="toolbar-controls">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="dashboard-select"
              >
                {statusOptions.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="dashboard-select"
              >
                <option value="date">Sort by date</option>
                <option value="price">Sort by price</option>
              </Form.Select>
              <Button
                variant="outline-secondary"
                className="sort-toggle"
                onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
              >
                <FiFilter /> {sortDirection === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </div>

          {loading || authLoading ? (
            <div className="dashboard-loading">
              <Spinner animation="border" role="status" />
              <span>Loading dashboard...</span>
            </div>
          ) : error ? (
            <div className="dashboard-error">
              <p>{error}</p>
            </div>
          ) : dashboardBookings.length === 0 ? (
            <div className="dashboard-empty-state">
              <h3>No bookings yet</h3>
              <p>Once you book a trip, it will appear here with status and payment details.</p>
              <Button variant="primary" href="about">
                Browse trips
              </Button>
            </div>
          ) : (
            <div className="dashboard-booking-grid">
              {dashboardBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isCancelled={booking.isCancelled}
                  onCancel={handleCancel}
                  onPayNow={handlePayNow}
                />
              ))}
            </div>
          )}

          {payMessage && <div className="dashboard-toast">{payMessage}</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
