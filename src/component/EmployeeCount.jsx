import React, { useEffect, useState } from "react";
import AttributionIcon from '@mui/icons-material/Attribution';
import { getEmployeeCount } from "../services/employeeService";

const EmployeeCount = () => {
  const [count , setCount] = useState(0);

  const fetchEmployeeCount = async()=>{
    try{
    const response =await getEmployeeCount();
    console.log(response);
    setCount(response);
   
    }
    catch(error){
      console.log(error);
      throw error
    }
  }

  useEffect(()=>{
    fetchEmployeeCount()
  }, [])

  return (
    <div className="border-white border-2 p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold">Employee Count</h2>
      <p>Total Employees</p>
      <p className=" my-4">{count}</p>
      <div className=" flex text-center justify-center align-middle">
  
<AttributionIcon style={{ fontSize: "80px", color: "#1976d2" }} />
      </div>
    </div>
  );
};

export default EmployeeCount;
