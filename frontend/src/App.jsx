import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryProvider } from "./providers/QueryProvider";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeContext } from './context/ThemeContext';
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import Layout from "./components/layout/Layout";
import { lightTheme, darkTheme } from './theme';

function App() {
  // toggle theme mode
  const [mode, setMode] = React.useState('light');
  const theme = React.useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode]
  );
  
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <QueryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/teachers" element={<TeachersPage />} />
                  {/* Add more routes as we build them */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </QueryProvider>
    </ThemeContext.Provider>
  );
}

export default App;