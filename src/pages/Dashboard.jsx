
import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Placeholder } from "react-bootstrap";
import { authContext } from "../components/context/AuthContext";
import { db } from "../Firebase/Firebase";
import { collection, doc, onSnapshot, query, updateDoc, where, getDocs } from "firebase/firestore";  
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useToast } from "../components/ToastContext";
import BookingCard from "../components/Dashboard/BookingCard";
// @ts-ignore
import DashboardCard from "../components/Dashboard/DashboardCard";
// @ts-ignore
import ChartCard from "../components/Dashboard/ChartCard";
import PaymentModal from "../components/PaymentModal";
import "./dashboard.css";

const statusOptions = ["All", "Pending", "Confirmed", "Cancelled"];

const normalizeDate = (value) => {
  if (!value) return null;
  if (value?.toDate) return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getMonthLabel = (date) =>
  date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

const Dashboard = () => {
  const { user, loading: authLoading } = useContext(authContext);
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [cancelledIds, setCancelledIds] = useState(new Set());
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [paymentState, setPaymentState] = useState("idle");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!user || authLoading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Use user.uid (Firebase UID) instead of user.id
      const userId = user.uid || user.id;
      
      console.log("Fetching data for user:", userId);
      
      const bookingsQuery = query(collection(db, "booking"), where("userId", "==", userId));
      const wishlistQuery = query(collection(db, "Wishlist"), where("userId", "==", userId));

      // Set up real-time listeners for bookings
      const unsubscribeBookings = onSnapshot(
        bookingsQuery,
        (snapshot) => {
          const userBookings = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));
          console.log("Bookings fetched:", userBookings);
          setBookings(userBookings);
          setLoading(false);
        },
        (error) => {
          console.error("Booking error:", error);
          setError("Failed to load bookings");
          setLoading(false);
        }
      );

      // Set up real-time listeners for wishlist
      const unsubscribeWishlist = onSnapshot(
        wishlistQuery,
        (snapshot) => {
          const favorites = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));
          setWishlist(favorites);
        },
        (error) => {
          console.error("Wishlist error:", error);
        }
      );

      // Return cleanup function to unsubscribe from listeners
      return () => {
        unsubscribeBookings();
        unsubscribeWishlist();
      };
    } catch (fetchError) {
      console.error("Dashboard load failed:", fetchError);
      setError("Unable to load your dashboard. Please try again later.");
      setLoading(false);
    }
  }, [user, authLoading]);

  const displayedName = user?.displayName || user?.email?.split("@")[0] || "Traveler";

  const dashboardBookings = useMemo(() => {
    const normalized = bookings.map((booking) => ({
      ...booking,
      isCancelled: cancelledIds.has(booking.id),
      status: cancelledIds.has(booking.id) ? "Cancelled" : booking.status || "Pending",
    }));

    const filtered = normalized.filter((booking) =>
      statusFilter === "All" ? true : booking.status === statusFilter
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "price") {
        const aPrice = Number(a.totalPrice ?? a.grandTotal ?? a.price ?? 0);
        const bPrice = Number(b.totalPrice ?? b.grandTotal ?? b.price ?? 0);
        return sortDirection === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }

      const aDate = normalizeDate(a.tripDate || a.date);
      const bDate = normalizeDate(b.tripDate || b.date);
      if (!aDate || !bDate) return 0;
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    });

    return sorted;
  }, [bookings, cancelledIds, statusFilter, sortBy, sortDirection]);

  const analytics = useMemo(() => {
    const counts = { Pending: 0, Confirmed: 0, Cancelled: 0 };
    let upcoming = 0;
    let revenue = 0;
    const lineMap = {};
    const barMap = {};
    const now = new Date();

    bookings.forEach((booking) => {
      const status = cancelledIds.has(booking.id) ? "Cancelled" : booking.status || "Pending";
      counts[status] = (counts[status] ?? 0) + 1;

      const tripDate = normalizeDate(booking.tripDate || booking.date);
      if (tripDate && tripDate > now && status !== "Cancelled") upcoming += 1;

      const amount = Number(booking.grandTotal ?? booking.totalPrice ?? booking.price ?? 0);
      revenue += status === "Cancelled" ? 0 : amount;

      const createdAt = normalizeDate(booking.createdAt);
      const createdLabel = createdAt ? getMonthLabel(createdAt) : "Other";
      lineMap[createdLabel] = (lineMap[createdLabel] ?? 0) + 1;

      const monthLabel = tripDate ? getMonthLabel(tripDate) : createdLabel;
      barMap[monthLabel] = (barMap[monthLabel] ?? 0) + amount;
    });

    const lineData = Object.entries(lineMap)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const barData = Object.entries(barMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));

    return { counts, upcoming, revenue, lineData, barData, pieData };
  }, [bookings, cancelledIds]);

  const statusCounts = analytics.counts;

  const handleCancel = (bookingId) => {
    setCancelledIds((prev) => new Set(prev).add(bookingId));
    addToast("Booking canceled locally.", "info");
  };

  const handlePayNow = (booking) => {
    setPaymentTarget(booking);
    setPaymentState("idle");
  };

  const closeModal = () => {
    setPaymentTarget(null);
    setPaymentState("idle");
    setPaymentLoading(false);
  };

  const processPayment = async () => {
    if (!paymentTarget) return;
    setPaymentLoading(true);
    setPaymentState("processing");

    await new Promise((resolve) => setTimeout(resolve, 1600));
    const success = Math.random() > 0.18;

    if (!success) {
      setPaymentState("failure");
      setPaymentLoading(false);
      addToast("Payment failed. Please try again.", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "booking", paymentTarget.id), { status: "Confirmed" });
      setBookings((prev) =>
        prev.map((item) => (item.id === paymentTarget.id ? { ...item, status: "Confirmed" } : item))
      );
      setPaymentState("success");
      addToast("Payment successful! Booking confirmed.", "success");
    } catch (updateError) {
      console.error("Payment update error:", updateError);
      setPaymentState("failure");
      addToast("Unable to update booking status.", "error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const renderSkeleton = () => (
    <div className="dashboard-loading-grid">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="dashboard-skeleton-card card-elevated">
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <div className="skeleton-row mt-4">
              <Placeholder animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder animation="glow">
                <Placeholder xs={4} />
              </Placeholder>
            </div>
            <div className="skeleton-row mt-3">
              <Placeholder animation="glow">
                <Placeholder xs={5} />
              </Placeholder>
              <Placeholder animation="glow">
                <Placeholder xs={7} />
              </Placeholder>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  return (
    <Container className="dashboard-page py-4">
      {/* DEBUG INFO - Simple version */}
      <div style={{ fontSize: "12px", background: "#f0f0f0", padding: "10px", marginBottom: "20px", borderRadius: "5px" }}>
        <p><strong>Debug:</strong> User: {user ? user.email : "Not logged in"} | Bookings: {bookings.length} | Loading: {loading ? "Yes" : "No"} | Error: {error || "None"}</p>
      </div>

      {!user && !authLoading && (
        <div className="dashboard-error" style={{ background: "#ffe0e0", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
          <h4>⚠️ Not Logged In</h4>
          <p>Please login to view your dashboard</p>
        </div>
      )}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-overline">Tourista Analytics</p>
          <h1>Manage your trips with confidence</h1>
          <p className="dashboard-intro">
            Live insights, booking status, and payment workflows in one premium control panel.
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

      <Row className="dashboard-grid dashboard-summary-grid">
        <Col lg={12} sm={6}>
          <DashboardCard icon={<FiTrendingUp />} title="Total Bookings" value={bookings.length} subtitle="Bookings recorded" />
        </Col>
        <Col lg={12} sm={6}>
          <DashboardCard icon={<FiDollarSign />} title="Revenue" value={`₹${analytics.revenue.toLocaleString()}`} subtitle="Estimated total" />
        </Col>
        <Col lg={12} sm={6}>
          <DashboardCard icon={<FiCalendar />} title="Upcoming Trips" value={analytics.upcoming} subtitle="Trips ahead" />
        </Col>
        <Col lg={12} sm={6}>
          <DashboardCard icon={<FiCheckCircle />} title="Cancelled" value={statusCounts.Cancelled} subtitle="Canceled bookings" accent="accent-danger" />
        </Col>
      </Row>

      <Row className="dashboard-grid dashboard-charts-grid">
        <Col lg={12}>
          <ChartCard title="Bookings Over Time" description="Monthly bookings trend.">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analytics.lineData} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>

        <Col lg={12}>
          <ChartCard title="Revenue Breakdown" description="Monthly revenue performance.">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={analytics.barData} margin={{ top: 16, right: 16, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>

        <Col lg={12}>
          <ChartCard title="Status Distribution" description="Active booking split.">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={analytics.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={4}>
                  {analytics.pieData.map((entry, index) => {
                    const colors = ["#6366f1", "#10b981", "#ef4444"];
                    return <Cell key={entry.name} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Col>
      </Row>

      <div className="dashboard-toolbar">
        <div className="toolbar-copy">
          <h5>Bookings</h5>
          <p>Sort and filter your active bookings with live payment preview.</p>
        </div>
        <div className="toolbar-controls">
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dashboard-select">
            {statusOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </Form.Select>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="dashboard-select">
            <option value="date">Sort by date</option>
            <option value="price">Sort by price</option>
          </Form.Select>
          <Button variant="outline-secondary" className="sort-toggle" onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}>
            <FiFilter /> {sortDirection === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      </div>

      {loading || authLoading ? (
        renderSkeleton()
      ) : error ? (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      ) : dashboardBookings.length === 0 ? (
        <div className="dashboard-empty-state">
          <div className="empty-illustration" aria-hidden="true">
            <div className="sun" />
            <div className="cloud" />
            <div className="plane" />
          </div>
          <h3>No bookings yet</h3>
          <p>Once you book a trip, it will appear here with status, preview, and payment details.</p>
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
              onPayNow={() => handlePayNow(booking)}
            />
          ))}
        </div>
      )}

      <PaymentModal show={Boolean(paymentTarget)} booking={paymentTarget} onClose={closeModal} onConfirm={processPayment} processing={paymentLoading} status={paymentState} />
    </Container>
  );
};

export default Dashboard;
