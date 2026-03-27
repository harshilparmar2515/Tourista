import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { trips } from "../data/tripData";
import { db } from "../Firebase/Firebase";
console.log("DB CHECK:", db);
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Form,
  FloatingLabel,
} from "react-bootstrap";

import { authContext } from "../components/context/AuthContext";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user, loading } = useContext(authContext);

  const selectedTrips = trips.find((t) => t.id === Number(id));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tripDate: "",
    totalPerson: 1,
    specialRequest: "",
    grandTotal: 0,
  });

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/Auth");
    }

    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user, loading, navigate]);

  // ✅ Calculate total
  useEffect(() => {
    if (selectedTrips) {
      setFormData((prev) => ({
        ...prev,
        grandTotal: prev.totalPerson * selectedTrips.price,
      }));
    }
  }, [formData.totalPerson]);

  const handleChange = (field, e) => {
    const value =
      field === "totalPerson" ? Number(e.target.value) : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ✅ SUBMIT FUNCTION (FINAL)
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("CLICKED");

    if (!user) {
      alert("Login First");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "booking"), {
        ...formData,
        tripId: id,
        tripName: selectedTrips.name,
        tripPrice: selectedTrips.price,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      console.log("Saved:", docRef.id);

      alert("Booking Successful ✅");

      setTimeout(() => {
        navigate("/"); // or /my-bookings
      }, 1000);

    } catch (error) {
      console.log("ERROR:", error);
      alert(error.message);
    }
  };
//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   console.log("CLICKED");

//   try {
//     console.log("DB:", db);

//     const docRef = await addDoc(collection(db, "test"), {
//       name: "test",
//     });

//     alert("SUCCESS");

//   } catch (error) {
//     console.error("FULL ERROR:", error);
//     alert("ERROR: " + error.message);
//   }
// };
  // ⏳ Loading
  if (loading) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  // ❌ Trip not found
  if (!selectedTrips) {
    return (
      <Container className="mt-5 text-center">
        <Card className="p-4 shadow">
          <h4>Trip Not Found</h4>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        {/* LEFT SIDE */}
        <Col md={6}>
          <Card className="shadow rounded-4">
            <Card.Img
              src={selectedTrips.image}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <Card.Body className="text-center">
              <Card.Title>{selectedTrips.name}</Card.Title>
              <h6>{selectedTrips.destination}</h6>

              <div className="d-flex justify-content-center gap-2">
                <Badge bg="primary">{selectedTrips.duration}</Badge>
                <Badge bg="secondary">{selectedTrips.rating}</Badge>
                <Badge bg="info">{selectedTrips.difficulty}</Badge>
                <Badge bg="success">₹{selectedTrips.price}</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT SIDE */}
        <Col md={6}>
          <Card className="p-4 shadow rounded-4">
            <h4 className="text-center mb-3">Book Your Trip</h4>

            <Form onSubmit={handleSubmit}>
              <FloatingLabel label="Name" className="mb-3">
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e)}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Email" className="mb-3">
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e)}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Phone" className="mb-3">
                <Form.Control
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e)}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Trip Date" className="mb-3">
                <Form.Control
                  type="date"
                  value={formData.tripDate}
                  onChange={(e) => handleChange("tripDate", e)}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Total Person" className="mb-3">
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.totalPerson}
                  onChange={(e) => handleChange("totalPerson", e)}
                  required
                />
              </FloatingLabel>

              <FloatingLabel label="Special Request" className="mb-3">
                <Form.Control
                  type="text"
                  value={formData.specialRequest}
                  onChange={(e) => handleChange("specialRequest", e)}
                />
              </FloatingLabel>

              <FloatingLabel label="Grand Total" className="mb-3">
                <Form.Control
                  type="text"
                  value={`₹ ${formData.grandTotal}`}
                  readOnly
                />
              </FloatingLabel>

              <div className="d-grid">
                <Button type="submit" variant="success">
                  Confirm Booking
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Booking;