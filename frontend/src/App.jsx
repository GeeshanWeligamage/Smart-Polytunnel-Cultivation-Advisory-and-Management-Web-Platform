import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

// Context
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Auth Pages
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Dashboards
import Home from "./pages/dashboard/home/Home";
import About from "./pages/dashboard/home/About";
import Contact from "./pages/dashboard/home/Contact";
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";

// --- New Admin Page Import ---
import ManageStructure from "./pages/dashboard/admin/ManageStructure";

// Farmer Pages
import FarmerDashboard from "./pages/dashboard/farmer/FarmerDashboard";
import Overviwe from "./pages/dashboard/farmer/Overview";
import TunnelDesign from "./pages/dashboard/farmer/TunnelDesign";
// ProfitCalculator import එක අයින් කළා
import AgroDoctor from "./pages/dashboard/farmer/AgroDoctor";

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/* ---------------- App Routes ---------------- */
const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const getDashboardRoute = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "farmer") return "/farmer-dashboard";
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />
        }
      />
      <Route path="/register" element={<Register />} />

      {/* ---------------- Admin Routes ---------------- */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-structure"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageStructure />
          </ProtectedRoute>
        }
      />

      {/* ---------------- Farmer Routes ---------------- */}
      <Route
        path="/farmer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/overview"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <Overviwe />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tunnel-design"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <TunnelDesign />
          </ProtectedRoute>
        }
      />

      {/* Profit Calculator Route එක අයින් කළා */}

      <Route
        path="/agro-doctor"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <AgroDoctor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

/* ---------------- Main App ---------------- */
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
