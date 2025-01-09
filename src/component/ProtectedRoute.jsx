import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";



const ProtectedRoute = ({ children }) => {
    const authState = useSelector((state) => state.auth);  // Accessing auth state from redux store
  const isAuthenticated = authState.isAuthenticated; 
    
    if (!isAuthenticated) {
      return <Login />;
    }
  
    return children;
  };
  
export default ProtectedRoute;
