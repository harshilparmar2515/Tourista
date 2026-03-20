import { Container, Row, Col, Image, Card, Button, Badge, ListGroup, Accordion } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { trips } from "../data/tripData";

import { useState, useEffect } from "react"; // ✅ ADD
import { onAuthStateChanged } from "firebase/auth"; // ✅ ADD
import { auth } from "../Firebase/Firebase"; // ✅ ADD

const TripDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const trip = trips.find((t) => t.id === Number(id));

  const [user, setUser] = useState(null);

  // ✅ check login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ✅ booking logic
  const handleBook = () => {
    if (!user) {
      alert("Please login first");
      navigate("/auth");   // 🔐 correct route
    } else {
      navigate("/booking"); // ✅ next page
    }
  };

  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col>
            <Image
              src={trip.image}
              className="rounded-5 shadow"
              style={{ height: "450px", width: "100%", objectFit: "cover" }}
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={8}>
            <h1>{trip.name}</h1>
            <h5 className="text-secondary">{trip.destination}</h5>

            <div className="d-flex gap-1">
              <Badge bg="primary">{trip.duration}</Badge>
              <Badge bg="secondary">{trip.rating}</Badge>
              <Badge bg="info">{trip.difficulty}</Badge>
              <Badge bg="success">₹{trip.price}</Badge>
            </div>

            <Row className="mt-3">
              <Col>
                <Card className="p-3 shadow">
                  <h5>Overview</h5>
                  <p>{trip.overview}</p>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Card className="p-3">
                  <h5>Trip Highlights</h5>
                  <ListGroup variant="flush">
                    {trip.highlights.map((h, i) => (
                      <ListGroup.Item key={i}>✅ {h}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Card className="p-3">
                  <h5>Day-wise itinerary</h5>
                  <Accordion flush>
                    {trip.itinerary.map((a, i) => (
                      <Accordion.Item eventKey={i.toString()} key={i}>
                        <Accordion.Header>
                          {a.day} - {a.title}
                        </Accordion.Header>
                        <Accordion.Body>{a.description}</Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={6}>
                <Card className="p-3">
                  <h5>Inclusion</h5>
                  <ListGroup variant="flush">
                    {trip.inclusions.map((i, idx) => (
                      <ListGroup.Item key={idx}>✔️ {i}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="p-3">
                  <h5>Exclusions</h5>
                  <ListGroup variant="flush">
                    {trip.exclusions.map((e, idx) => (
                      <ListGroup.Item key={idx}>❌ {e}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Card className="p-3">
                  <h5>Best Time To Visit</h5>
                  <p>{trip.bestTimeToVisit}</p>
                </Card>
              </Col>
            </Row>

            <Button onClick={() => navigate(-1)} className="mt-3">
              ⬅️ Back to trips
            </Button>
          </Col>

          <Col lg={4}>
            <Card className="p-3 shadow sticky-top" style={{ top: "50px" }}>
              <h3>₹{trip.price}</h3>
              <h6>{trip.duration} - {trip.difficulty}</h6>

              <div className="d-grid gap-2">
                <Button onClick={handleBook}>
                  Book now
                </Button>

                <Button variant="outline-secondary">
                  Inquiry now
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TripDetail;