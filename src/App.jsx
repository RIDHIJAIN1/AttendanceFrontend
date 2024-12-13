import { useState } from 'react'
import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Counter } from './features/counter/Counter';
import {ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import DashboardLayoutAccount from './component/DashBoardLayout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';
import EmployeeData from './pages/EmployeeData';
import Calender from './pages/Calender';
import AttendanceTable from './pages/AttendanceTable';
import Payroll from './pages/PayrollData';
// import AttendanceChart from './component/AttendanceChart';
// import EmployeeData from './pages/EmployeeData';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
    <Routes>
          <Route path='/counter'element={<Counter/>}/>
          <Route path='/add'element={<EmployeeForm/>}/>
          <Route path='/signup'element={<Signup/>}/>
          <Route path='/login'element={<Login/>}/>
          <Route path='/home'element={<Home/>}/>
          <Route path="/calender" element={<Calender/>} />
          <Route path="/attendance" element={<AttendanceTable/>} />
          {/* <Route path="/" element={<AttendanceChart/>} /> */}
          <Route path="employee/:employeeId" element={<EmployeeData/>} />
          <Route path="/" element={<DashboardLayoutAccount />}>
          <Route path="/" element={<Home />} />
          <Route path="add" element={<EmployeeForm />} />
          <Route path="attendance" element={<AttendanceTable/>} />
          <Route path="payroll" element={<Payroll/>} />
          <Route path="employeedetails" element={<EmployeeDetails/>} />
         
         
        </Route>
    </Routes>
    <ToastContainer/>

  </Router>
  )
}

export default App
