import React, { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { auth, provider } from "../../Firebase/Firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [authData, setAuthData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState(null);
  const [type, setType] = useState("");

  const handleChange = (field, e) => {
    setAuthData({
      ...authData,
      [field]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        setMessage("Login Successful");
        setType("success");
      } else {
        await createUserWithEmailAndPassword(
          auth,
          authData.email,
          authData.password
        );
        setMessage("Account Created");
        setType("success");
      }

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setMessage(err.message);
      setType("danger");
    }
  };

  const handleGoogleLogin = async () => {
    try {

      await signInWithPopup(auth, provider);
      setMessage("Google Login Successful");
      setType("success");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {

      setMessage(err.message);
      setType("danger");
    }
  };

  return (
    <div
    
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212"
      }}
    >
      <Card
        style={{
          width: "350px",
          padding: "25px",
          borderRadius: "15px",
          background: "#1e1e1e",
          color: "white"
        }}
      >
        <h3 className="text-center mb-3">
          {isLogin ? "Login" : "Register"}
        </h3>

        {message && <Alert variant={type}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) => handleChange("email", e)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) => handleChange("password", e)}
              required
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2">
            {isLogin ? "Login" : "Register"}
          </Button>

          <Button
            variant="outline-light"
            className="w-100 mb-3"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </Form>

        <p className="text-center">
          {isLogin ? "Don't have account?" : "Already have account?"}{" "}
          <span
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </Card>
    </div>
  );
};

export default Auth;