import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ requiredAgent }) => {
    const token = localStorage.getItem("authToken");
    const isAgent = localStorage.getItem("isAgent") === "true"; // Convert string to boolean

    // If user is not logged in, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If agent pages are protected & user is NOT an agent, redirect to home
    if (requiredAgent && !isAgent) {
        return <Navigate to="/" />;
    }

    // If user pages are protected & user IS an agent, redirect to agent dashboard
    if (!requiredAgent && isAgent) {
        return <Navigate to="/dashboard" />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
