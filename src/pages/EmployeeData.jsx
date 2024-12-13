import React, { useEffect, useState } from "react";
import { Switch, Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getEmployeeDataById } from "../services/employeeService";
import { useParams } from "react-router-dom";
import EditEmployeeModal from "../component/EditEmployeeModal";
import DeleteEmployeeModal from "../component/DeleteEmployeeModal";
import { APP_URL } from "../config/config";
import { capitalize } from "lodash";


const EmployeeData = () => {
  const { employeeId } = useParams();
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

  useEffect(() => {
    const fetchEmployeeById = async () => {
      try {
        const fetchedEmployee = await getEmployeeDataById(employeeId);
        setEmployeeList([fetchedEmployee]); // Add the fetched employee to the list
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
      }
    };

    if (employeeId) fetchEmployeeById();
  }, [employeeId] , employeeList );

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = (updatedEmployee) => {
    setEmployeeList([updatedEmployee]); // Replace the only employee
    closeEditModal();
    window.location.reload();
  };

  const handleDelete = (id) => {
    setEmployeeList((prev) => prev.filter((emp) => emp.id !== id));
    setDeleteEmployeeId(null);
  };

  function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Employee Table</h2>
        </div>
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-600">#</th>
              <th className="p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="p-4 text-sm font-medium text-gray-600">Designation</th>
              <th className="p-4 text-sm font-medium text-gray-600">Contact</th>
              <th className="p-4 text-sm font-medium text-gray-600">Address</th>
          
              <th className="p-4 text-sm font-medium text-gray-600">Hourly Rate</th>
              <th className="p-4 text-sm font-medium text-gray-600">Join Date</th>
              <th className="p-4 text-sm font-medium text-gray-600">Identity</th>
              <th className="p-4 text-sm font-medium text-gray-600">Advance</th>
              <th className="p-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee, index) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-800">{index + 1}</td>
                <td className="p-4 flex items-center space-x-3">
                  <Avatar sx={{ width: 32, height: 32 }}>{employee.name[0]}</Avatar>
                  <span className="text-gray-800">{toTitleCase(employee.name)}</span>
                </td>
                <td className="p-4 text-gray-800">{toTitleCase(employee.designation)}</td>
                <td className="p-4 text-gray-800">{employee.contact}</td>
                <td className="p-4 text-gray-800">{employee.address}</td>
                <td className="p-4 text-gray-800">{employee.hourly_rate}</td>
                <td className="p-4 text-gray-800">{employee.join_date}</td>
                <td className="p-4 text-gray-800">
  {employee.identityCard ? (
    <img
      src={`${APP_URL}${employee.identityCard.startsWith("/") ? employee.identityCard : `/${employee.identityCard}`}`}
      alt="Identity Card"
      className="h-16 w-auto object-contain"
    />
  ) : (
    <span className="text-gray-500">No Image Available</span>
  )}
</td>

                <td className="p-4 text-gray-800">{employee.advance_pay}</td>
 
                <td className="p-4 flex items-center space-x-2">
                  <IconButton onClick={() => openEditModal(employee)}>
                    <EditIcon className="text-blue-500" />
                  </IconButton>
                  <IconButton onClick={() => setDeleteEmployeeId(employee._id)}>
                    <DeleteIcon className="text-red-500" />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {editModalOpen && (
        <EditEmployeeModal
          employee={selectedEmployee}
          onSave={handleSave}
          onClose={closeEditModal}
        />
      )}
      {deleteEmployeeId && (
        <DeleteEmployeeModal
          employeeId={deleteEmployeeId}
          onDelete={handleDelete}
          onClose={() => setDeleteEmployeeId(null)}
        />
      )}
    </div>
  );
};

export default EmployeeData;
