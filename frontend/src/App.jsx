import { Box } from "@chakra-ui/react";
import { Route, Routes, useLocation } from "react-router-dom";
import RegisterationPage from "./pages/RegisterationPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./private/ProtectedRoutes";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar/Navbar";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const location = useLocation();
  const hideNavbarPaths = ["/register", "/login"];

  return (
    <Box>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/register" element={<RegisterationPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
