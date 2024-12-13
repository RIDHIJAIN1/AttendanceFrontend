import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Switch } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getEmployeeData } from "../services/employeeService";

const EmployeeTable = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust the number of items per page here

  const fetchEmployeeDetails = async () => {
    try {
      const employees = await getEmployeeData();
      setEmployeeList(employees);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  // Filter employees based on the search term
  const filteredEmployees = employeeList.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current employees based on pagination
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen w-11/12 mx-auto">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex p-4 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            Employee Table
          </h2>
          <AddCircleIcon
            style={{
              fontSize: "30px",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
          />
          <input
            type="text"
            placeholder="Search by name"
            className="ml-auto p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-600">#</th>
              <th className="p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="p-4 text-sm font-medium text-gray-600">
                Designation
              </th>
              <th className="p-4 text-sm font-medium text-gray-600">Contact</th>
              <th className="p-4 text-sm font-medium text-gray-600">Active</th>
              <th className="p-4 text-sm font-medium text-gray-600">
                More Details
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-gray-800">{index + 1 + indexOfFirstEmployee}</td>
                  <td className="p-4 flex items-center space-x-3">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {employee.name[0]}
                    </Avatar>
                    <span className="text-gray-800">{employee.name}</span>
                  </td>
                  <td className="p-4 text-gray-800">{employee.designation}</td>
                  <td className="p-4 text-gray-800">{employee.contact}</td>
                  <td className="p-4">
                    <Switch checked={employee.isActive} color="primary" />
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/employee/${employee._id}`}
                      className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
                    >
                      View More
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: Math.ceil(filteredEmployees.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;