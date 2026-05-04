// front/src/app/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

/**
 * Lee el JWT del localStorage, lo decodifica y protege rutas por rol.
 *
 * Props:
 *  - allowedRoles: string[]  ej. ['ADMIN'] o ['CLIENT']
 *  - redirectTo:   string    ruta a redirigir si no tiene permiso (default "/")
 */
export const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/" }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to={redirectTo} replace />;

  try {
    // Decodifica el payload (no verifica firma — eso lo hace el backend)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role = payload?.role;

    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      // Redirige al dashboard correcto según su rol real
      if (role === "ADMIN") return <Navigate to="/dashboard/accounts" replace />;
      if (role === "CLIENT") return <Navigate to="/dashboard/client" replace />;
      return <Navigate to={redirectTo} replace />;
    }

    return children;
  } catch {
    // Token malformado
    localStorage.removeItem("token");
    return <Navigate to={redirectTo} replace />;
  }
};
