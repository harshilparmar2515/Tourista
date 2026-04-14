import { useEffect, useState } from "react";
import { Button, Modal, ProgressBar } from "react-bootstrap";

const PaymentModal = ({ booking, show, onClose, onConfirm, processing, status }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 12, 100));
    }, 160);
    return () => clearInterval(interval);
  }, [show, status]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tourista Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-modal-card">
          <div className="payment-modal-brand">
            <div />
            <div>
              <h5>RazorPay Demo</h5>
              <p>Secure checkout for Tourista bookings</p>
            </div>
          </div>

          <div className="payment-summary">
            <div>
              <small>Booking</small>
              <p>{booking?.tripName || "Travel Plan"}</p>
            </div>
            <div>
              <small>Amount</small>
              <p>₹{Number(booking?.grandTotal ?? booking?.totalPrice ?? 0).toLocaleString()}</p>
            </div>
          </div>

          {processing ? (
            <div className="payment-progress-group">
              <ProgressBar now={progress} label={`${progress}%`} animated />
              <p className="text-muted mt-3">Processing your payment. Please wait...</p>
            </div>
          ) : status === "success" ? (
            <div className="payment-result success">Payment completed successfully!</div>
          ) : status === "failure" ? (
            <div className="payment-result failure">Payment failed. Try again or use a different card.</div>
          ) : (
            <div className="payment-instructions">
              <p>Use the demo gateway to confirm this booking. No real payment is processed.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={processing}>
          Close
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={processing}>
          Pay ₹{Number(booking?.grandTotal ?? booking?.totalPrice ?? 0).toLocaleString()}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;
