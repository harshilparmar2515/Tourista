import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { collection, deleteDoc, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { authContext } from "../components/context/AuthContext";
import { useToast } from "../components/ToastContext";
import AdminTable from "../components/AdminTable";
import { FiTrash2, FiEdit3, FiCheckCircle, FiUsers, FiMessageSquare } from "react-icons/fi";
import "./admin.css";

const Admin = () => {
  const { user, isAdmin } = useContext(authContext);
  const { addToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user || !isAdmin) return;
      setLoading(true);

      try {
        const bookingsSnapshot = await getDocs(collection(db, "booking"));
        const contactSnapshot = await getDocs(collection(db, "contacts"));

        setBookings(
          bookingsSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
        );
        setContacts(
          contactSnapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }))
        );
      } catch (error) {
        console.error("Admin fetch failed:", error);
        addToast("Could not retrieve admin data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, isAdmin, addToast]);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    setActionLoading(bookingId);

    try {
      await deleteDoc(doc(db, "booking", bookingId));
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      addToast("Booking deleted successfully.", "success");
    } catch (error) {
      console.error("Delete booking failed:", error);
      addToast("Failed to delete booking.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStatus = async (booking, nextStatus) => {
    setActionLoading(booking.id);
    try {
      await updateDoc(doc(db, "booking", booking.id), { status: nextStatus });
      setBookings((prev) =>
        prev.map((item) => (item.id === booking.id ? { ...item, status: nextStatus } : item))
      );
      addToast(`Booking marked ${nextStatus}.`, "success");
    } catch (error) {
      console.error("Update status failed:", error);
      addToast("Status update failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { Pending: 0, Confirmed: 0, Cancelled: 0 };
    bookings.forEach((booking) => {
      const status = booking.status || "Pending";
      counts[status] = (counts[status] ?? 0) + 1;
    });
    return counts;
  }, [bookings]);

  const bookingColumns = [
    { key: "tripName", label: "Trip" },
    { key: "email", label: "Guest" },
    { key: "tripDate", label: "Travel Date" },
    { key: "grandTotal", label: "Amount", render: (booking) => `₹${Number(booking.grandTotal ?? booking.price ?? 0).toLocaleString()}` },
    { key: "status", label: "Status", render: (booking) => <Badge bg={booking.status === "Confirmed" ? "success" : booking.status === "Cancelled" ? "danger" : "warning"}>{booking.status || "Pending"}</Badge> },
    {
      key: "actions",
      label: "Actions",
      render: (booking) => (
        <div className="admin-action-buttons">
          <Button
            size="sm"
            variant="outline-success"
            disabled={actionLoading === booking.id || booking.status === "Confirmed"}
            onClick={() => handleUpdateStatus(booking, "Confirmed")}
          >
            <FiCheckCircle />
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            disabled={actionLoading === booking.id}
            onClick={() => handleDeleteBooking(booking.id)}
          >
            <FiTrash2 />
          </Button>
        </div>
      ),
    },
  ];

  const contactColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Submitted" },
  ];

  return (
    <Container className="admin-page py-5">
      <div className="admin-header">
        <div>
          <p className="dashboard-overline">Admin panel</p>
          <h1>Tourista Control Room</h1>
          <p>Manage bookings, review customer messages, and keep the dashboard up to date.</p>
        </div>
        <div className="admin-summary-cards">
          <div className="admin-summary-card card-elevated">
            <h5>Total Bookings</h5>
            <p>{bookings.length}</p>
          </div>
          <div className="admin-summary-card card-elevated">
            <h5>Confirmed</h5>
            <p>{statusCounts.Confirmed}</p>
          </div>
          <div className="admin-summary-card card-elevated">
            <h5>Cancelled</h5>
            <p>{statusCounts.Cancelled}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">
          <Spinner animation="border" />
          <span>Loading admin data...</span>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col lg={8}>
              <AdminTable title="All Bookings" columns={bookingColumns} rows={bookings} />
            </Col>
            <Col lg={4}>
              <div className="admin-panel-info card-elevated">
                <h4>
                  <FiUsers className="me-2" /> Administrator
                </h4>
                <p>As Tourista admin, you can approve, delete, or recover bookings and review all customer contact submissions in one place.</p>
                <div className="admin-info-badges">
                  <Badge bg="primary">Live</Badge>
                  <Badge bg="success">Firebase</Badge>
                  <Badge bg="secondary">Responsive</Badge>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col>
              <AdminTable title={`Contact submissions (${contacts.length})`} columns={contactColumns} rows={contacts} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Admin;
