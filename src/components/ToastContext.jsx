import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const useToast = () => {
  return useContext(ToastContext);
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++toastIdCounter;
    const newToast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container-custom">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-custom toast-${toast.type}`}>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              ×
            </button>
            <p className="toast-message">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};