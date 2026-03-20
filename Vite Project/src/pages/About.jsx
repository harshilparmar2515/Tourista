import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";

function About() {
const navigate = useNavigate(); 
const places = [
{ id:1, title:"Paris, France", img:"https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg", desc:"Eiffel Tower and romantic streets."},
{ id:2, title:"London, UK", img:"https://images.pexels.com/photos/8942324/pexels-photo-8942324.jpeg", desc:"Big Ben, London Eye and royal culture."},
{ id:3, title:"Dubai, UAE", img:"https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg", desc:"Luxury city with Burj Khalifa."},
{ id:4, title:"New York, USA", img:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D", desc:"Times Square and Statue of Liberty."},
{ id:5, title:"Tokyo, Japan", img:"https://images.pexels.com/photos/2337920/pexels-photo-2337920.jpeg", desc:"Modern city with ancient temples."},

{ id:6, title:"Rome, Italy", img:"https://images.pexels.com/photos/753639/pexels-photo-753639.jpeg", desc:"Historic city with the Colosseum."},
{ id:7, title:"Barcelona, Spain", img:"https://images.pexels.com/photos/6432511/pexels-photo-6432511.jpeg", desc:"Famous for Gaudi architecture."},
{ id:8, title:"Bali, Indonesia", img:"https://images.pexels.com/photos/2082949/pexels-photo-2082949.jpeg", desc:"Beautiful beaches and temples."},
{ id:9, title:"Santorini, Greece", img:"https://images.pexels.com/photos/1518500/pexels-photo-1518500.jpeg", desc:"White houses and blue domes."},
{ id:10, title:"Istanbul, Turkey", img:"https://images.pexels.com/photos/4050283/pexels-photo-4050283.jpeg", desc:"Historic city between two continents."},

{ id:11, title:"Bangkok, Thailand", img:"https://images.pexels.com/photos/8299699/pexels-photo-8299699.jpeg", desc:"Temples, markets and nightlife."},
{ id:12, title:"Singapore", img:"https://images.pexels.com/photos/302820/pexels-photo-302820.jpeg", desc:"Futuristic skyline and Marina Bay."},
{ id:13, title:"Sydney, Australia", img:"https://images.pexels.com/photos/35517293/pexels-photo-35517293.jpeg", desc:"Opera House and beautiful harbour."},
{ id:14, title:"Maldives", img:"https://images.pexels.com/photos/9149367/pexels-photo-9149367.jpeg", desc:"Crystal clear water and luxury resorts."},
{ id:15, title:"Cape Town, South Africa", img:"https://images.pexels.com/photos/3770287/pexels-photo-3770287.jpeg", desc:"Table Mountain and ocean views."},

{ id:16, title:"Rio de Janeiro, Brazil", img:"https://images.pexels.com/photos/45917/pexels-photo-45917.jpeg", desc:"Christ the Redeemer statue."},
{ id:17, title:"Toronto, Canada", img:"https://images.pexels.com/photos/1750754/pexels-photo-1750754.jpeg", desc:"CN Tower and multicultural city."},
{ id:18, title:"Amsterdam, Netherlands", img:"https://images.pexels.com/photos/20555138/pexels-photo-20555138.jpeg", desc:"Beautiful canals and bikes."},
{ id:19, title:"Prague, Czech Republic", img:"https://images.pexels.com/photos/18642133/pexels-photo-18642133.jpeg", desc:"Fairytale castles and bridges."},
{ id:20, title:"Vienna, Austria", img:"https://images.pexels.com/photos/3823093/pexels-photo-3823093.jpeg", desc:"Classical music and palaces."},

{ id:21, title:"Zurich, Switzerland", img:"https://images.pexels.com/photos/15214034/pexels-photo-15214034.jpeg", desc:"Beautiful lakes and mountains."},
{ id:22, title:"Agra, India", img:"https://images.pexels.com/photos/602607/pexels-photo-602607.png", desc:"Home of the Taj Mahal."},
{ id:23, title:"Jaipur, India", img:"https://images.pexels.com/photos/13062114/pexels-photo-13062114.jpeg", desc:"The Pink City with royal forts."},
{ id:24, title:"Goa, India", img:"https://images.pexels.com/photos/28368721/pexels-photo-28368721.jpeg", desc:"India’s famous beach destination."},
{ id:25, title:"Queenstown, New Zealand", img:"https://images.pexels.com/photos/7918293/pexels-photo-7918293.jpeg", desc:"Adventure capital of the world."}
];

  return (
    <div style={{marginTop:"30px", padding:"20px"}}>

      <h1 style={{textAlign:"center", marginBottom:"40px"}}>
        Popular Destinations
      </h1>

      <Row>

        {places.map((place) => (

          <Col md={3} key={place.id}>

            <Card style={{ marginBottom: "20px" }}>

              <Card.Img variant="top" src={place.img} />

              <Card.Body className="text-center">

                <Card.Title>{place.title}</Card.Title>

                <Card.Text>{place.desc}</Card.Text>

                <Button
                   variant="primary"
                      onClick={() => navigate(`/trip/${place.id}`)}
                          >
                           Explore
</Button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>

    </div>
  );
}

export default About;