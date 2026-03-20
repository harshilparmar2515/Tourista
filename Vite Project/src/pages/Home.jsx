import Carousel from "react-bootstrap/Carousel";
import { Image } from "react-bootstrap";

function CarouselFadeExample() {
  return (
    <Carousel fade>
      <Carousel.Item style={{ height: "95vh" }}>
        <video
          autoPlay
          muted
          loop
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        >
          <source src="https://www.pexels.com/download/video/5735794/"></source>
        </video>

        <Carousel.Caption>
          <h3 className="display-1">Explore the World Beyond Limits</h3>
          <p className="fs-5">
            Discover breathtaking destinations, hidden gems, and unforgettable
            experiences. Your next adventure begins here.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item style={{ height: "95vh" }}>
        <Image
          src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg"
          alt="slide-2"
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        ></Image>
        <Carousel.Caption>
          <h3 className="display-1 text-dark">Discover Beautiful Destinations</h3>
          <p className="fs-5 text-dark" >
            From crystal-clear beaches to majestic mountains, travel to places
            that inspire your soul and create lifelong memories.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item style={{ height: "95vh" }}>
         <video
          autoPlay
          muted
        l loop
          style={{ objectFit: "cover", height: "100%", width: "100%" }}
        >
          <source src="https://www.pexels.com/download/video/3119307/"></source>
        </video>
        <Carousel.Caption>
          <h1 className="display-1">Travel. Experience. Remember.</h1>
          <p className="fs-5">
            Explore vibrant cultures, taste local cuisines, and experience the
            world like never before.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFadeExample; 