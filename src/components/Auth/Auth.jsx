import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, provider } from "../../Firebase/Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "./auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, e) => {
    setAuthData({
      ...authData,
      [field]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
        setSuccess("Login Successful! Redirecting...");
        setTimeout(() => navigate(redirectPath), 1000);
      } else {
        
        if (authData.password !== authData.confirmPassword) {
          setError("Passwords do not match!");
          setLoading(false);
          return;
        }
        if (authData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }

        await createUserWithEmailAndPassword(auth, authData.email, authData.password);
        setSuccess("Account Created! Redirecting...");
        setTimeout(() => navigate(redirectPath), 1000);
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, provider);
      setSuccess("Google Login Successful! Redirecting...");
      setTimeout(() => navigate(redirectPath), 1000);
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
      <div className="auth-background">
        <div className="auth-bg-blur blob1"></div>
        <div className="auth-bg-blur blob2"></div>
        <div className="auth-bg-blur blob3"></div>
      </div>

      <Container className="auth-wrapper">
        
        <Button
          variant="link"
          className="btn-back"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft /> Back Home
        </Button>

        
        <div className="auth-card glassmorphism">
          
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? "Welcome Back" : "Join Tourista"}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? "Access your account and continue your travel journey"
                : "Create an account to book amazing trips"}
            </p>
          </div>

    
          {error && (
            <div className="alert alert-danger auth-alert">
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

      
          {success && (
            <div className="alert alert-success auth-alert">
              <strong>✓ Success:</strong> {success}
            </div>
          )}

    
          <Form onSubmit={handleSubmit} className="auth-form">
          
            <Form.Group className="form-group-custom">
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={authData.email}
                  onChange={(e) => handleChange("email", e)}
                  required
                  className="input-custom"
                  disabled={loading}
                />
              </div>
            </Form.Group>

            {/* Password Field */}
            <Form.Group className="form-group-custom">
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={authData.password}
                  onChange={(e) => handleChange("password", e)}
                  required
                  className="input-custom"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </Form.Group>

            {!isLogin && (
              <Form.Group className="form-group-custom">
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={authData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e)}
                    required
                    className="input-custom"
                    disabled={loading}
                  />
                </div>
              </Form.Group>
            )}

            
            {isLogin && (
              <div className="form-options">
                <Form.Check
                  type="checkbox"
                  label="Remember me"
                  className="remember-checkbox"
                />
                <a href="#forgot" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
            )}

          
            <Button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {isLogin ? "Logging in..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Login" : "Create Account"}
                  <FiArrowRight />
                </>
              )}
            </Button>

            <div className="divider">
              <span>or</span>
            </div>

      
            <Button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FcGoogle /> Continue with Google
            </Button>
          </Form>


          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                className="toggle-btn"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                  setAuthData({
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

       
          <p className="auth-footer">
            By continuing, you agree to our{" "}
            <a href="#terms">Terms of Service</a> and{" "}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Auth;