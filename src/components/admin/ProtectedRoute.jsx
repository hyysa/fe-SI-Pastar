import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // 1. Cek Login (Token & Status)
  if (!token || isLoggedIn !== "true") {
    return <Navigate to="/login" replace />;
  }

  // 2. Cek Role (Jika rute tersebut membatasi role)
  if (allowedRoles) {
    // Ambil role user dan ubah ke huruf kecil supaya cocok
    const userRole = user?.role ? user.role.toLowerCase() : "";
    
    if (!allowedRoles.includes(userRole)) {
      // Jika role tidak cocok, lempar ke dashboard (bukan login, karena dia sudah login)
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  /**
   * 3. LOGIKA RENDER (PENTING!)
   * - Jika ada 'children', tampilkan children (untuk pembungkus Layout utama).
   * - Jika tidak ada 'children', tampilkan <Outlet /> (untuk Route element).
   */
  return children ? children : <Outlet />;
};

export default ProtectedRoute;