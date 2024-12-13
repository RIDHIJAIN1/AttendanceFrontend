import React from "react";
import AttributionIcon from '@mui/icons-material/Attribution';

const EmployeeCount = () => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold">Employee Count</h2>
      <p className="text-gray-500">Total Employees</p>
      <p className="text-gray-500 my-4">15</p>
      <div className=" flex text-center justify-center align-middle">
  
<AttributionIcon style={{ fontSize: "80px", color: "#1976d2" }} />
      </div>
    </div>
  );
};

export default EmployeeCount;
