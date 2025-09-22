import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user")); // assume login stores user here
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
}

export default AdminRoute;
