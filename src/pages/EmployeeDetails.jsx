import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { Switch, TextField, TablePagination } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getEmployeeData } from "../services/employeeService";
import EmployeeForm from "./EmployeeForm";

const EmployeeTable = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);

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

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get current employees for the current page
  const currentEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpen = () => {
    setOpen(true);
  };

  function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  const handleClose = () => {
    setOpen(false);
    fetchEmployeeDetails();
  };

  return (
    <div className="min-h-screen w-11/12 mx-auto">
      <div className="max-w-7xl mx-auto rounded-lg shadow-lg overflow-hidden">
        <div className="flex p-4 border-b justify-between">
          <div className="flex mt-2">
            <h2 className="text-2xl font-semibold">Employee Table</h2>
            <AddCircleIcon
              style={{
                fontSize: "30px",
                marginBottom: "10px",
                marginLeft: "10px",
              }}
              onClick={handleOpen}
            />
          </div>
          <EmployeeForm open={open} handleClose={handleClose} />
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto max-w-full">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-4 text-sm font-medium">#</th>
              <th className="p-4 text-sm font-medium">Name</th>
              <th className="p-4 text-sm font-medium">Designation</th>
              <th className="p-4 text-sm font-medium">Contact</th>
              <th className="p-4 text-sm font-medium">Active</th>
              <th className="p-4 text-sm font-medium">More Details</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee, index) => (
                <tr key={employee.id} className="border-b hover:bg-gray-400">
                  <td className="p-4">
                    {index + 1 + page * rowsPerPage}
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {toTitleCase(employee.name[0])}
                    </Avatar>
                    <span>{toTitleCase (employee.name)}</span>
                  </td>
                  <td className="p-4">{toTitleCase(employee.designation)}</td>
                  <td className="p-4">{employee.contact}</td>
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
        </div>
        {/* Material UI Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default EmployeeTable;
