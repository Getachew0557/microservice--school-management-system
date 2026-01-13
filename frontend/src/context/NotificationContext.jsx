/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificationContext = createContext({});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, severity = 'info', duration = 6000) => {
    const id = Date.now();
    setNotifications((prev) => [
      ...prev,
      { id, message, severity, duration, open: true },
    ]);
    return id;
  }, []);

  const showSuccess = useCallback((message) => {
    return showNotification(message, 'success');
  }, [showNotification]);

  const showError = useCallback((message) => {
    return showNotification(message, 'error');
  }, [showNotification]);

  const showWarning = useCallback((message) => {
    return showNotification(message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((message) => {
    return showNotification(message, 'info');
  }, [showNotification]);

  const handleClose = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, open: false } : notification
      )
    );
    
    // Remove from state after animation
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  }, []);

  const handleExited = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={notification.open}
          autoHideDuration={notification.duration}
          onClose={() => handleClose(notification.id)}
          TransitionProps={{ onExited: () => handleExited(notification.id) }}
          sx={{ mb: 2 }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%', boxShadow: 3 }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};