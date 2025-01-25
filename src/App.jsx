import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardLayoutAccount from "./component/DashBoardLayout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import EmployeeData from "./pages/EmployeeData";
import AttendanceTable from "./pages/AttendanceTable";
import ProtectedRoute from "./component/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./app/store";
import { checkAuthState } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthState());
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  return (
    <Provider store={store}>
      <Router>
        <Routes>
      
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <DashboardLayoutAccount /> : <Navigate to="/login" />} />
          <Route path="/" element= {<Home/>}/>
              <Route path="/attendance" element={<AttendanceTable />} />
          <Route/>
        
          <Route path="*" element={<NotFoundPage />} />
          <Route path="employee/:employeeId" element={<EmployeeData />} />
        </Routes>
        <ToastContainer />
      </Router>
    </Provider>
  );
}

export default App;
