import React, { useState } from "react";
import "./Contact.css";
import { db } from "../Firebase/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (field, e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting...");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp()
      });

      alert("Message Sent Successfully ✅");

      setFormData({
        name: "",
        email: "",
        message: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error sending message ❌");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-card">

        <div className="contact-left">
          <h2>Contact Us 🌍</h2>
          <p>Send us your message anytime!</p>
        </div>

        <div className="contact-right">
          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e)}
                required
              />
              <label>Name</label>
            </div>

            <div className="input-group">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e)}
                required
              />
              <label>Email</label>
            </div>

            <div className="input-group">
              <textarea
                value={formData.message}
                onChange={(e) => handleChange("message", e)}
                required
              ></textarea>
              <label>Message</label>
            </div>

            <button type="submit">Send Message 🚀</button>

          </form>
        </div>
              
      </div> 
      {/* MAP SECTION */}
      <div className="map-section">
        <div className="map-section">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59286.18951149863!2d72.12112332179962!3d21.76528424889217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5081abb84e2f%3A0xf676d64c6e13716c!2sBhavnagar%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1774865941254!5m2!1sen!2sin"
    width="100%"
    height="350"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Bhavnagar Map"
  ></iframe>
</div>
      </div>
    </div>
    
  );
  
};

export default Contact;