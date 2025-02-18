import React, { useEffect, useState } from "react";
import { Switch, Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getEmployeeDataById } from "../services/employeeService";
import { useNavigate, useParams } from "react-router-dom";
import EditEmployeeModal from "../component/EditEmployeeModal";
import DeleteEmployeeModal from "../component/DeleteEmployeeModal";
import { APP_URL } from "../config/config";
import { capitalize } from "lodash";
import { ArrowLeftIcon } from "@mui/x-date-pickers";


const EmployeeData = () => {
  const { employeeId } = useParams();
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

const navigate = useNavigate();

  const fetchEmployeeById = async () => {
    try {
      const fetchedEmployee = await getEmployeeDataById(employeeId);
      
      setEmployeeList([fetchedEmployee]); // Add the fetched employee to the list
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
    }
  };


  useEffect(() => {
    
    if (employeeId) fetchEmployeeById();
  }, [employeeId]);

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSave = async(updatedEmployee) => {
   await fetchEmployeeById();
    closeEditModal();
    // window.location.reload();
  };

  const handleDelete = (id) => {
    setEmployeeList((prev) => prev.filter((emp) => emp.id !== id));
    setDeleteEmployeeId(null);
  };

  function toTitleCase(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }

  useEffect(() => {
    console.log("Updated Employee List:", employeeList);
  }, [employeeList])

  const getBack=()=>{
    navigate(-1)
  }
  

  return (
    <div className="p-6  min-h-screen">
       

      <div className="flex m-0 p-0 cursor-pointer "onClick={getBack}>
        <div >
      <ArrowLeftIcon className="p-0 m-0"/>
      </div>
      <div className="m-0">
       Back
       </div>
      </div>
         
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold ">Employee Table</h2>
        </div>
        <div className="overflow-x-auto max-w-full">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-medium ">#</th>
              <th className="p-4 text-sm font-medium ">Name</th>
              <th className="p-4 text-sm font-medium ">Designation</th>
              <th className="p-4 text-sm font-medium ">Contact</th>
              <th className="p-4 text-sm font-medium ">Address</th>
          
              <th className="p-4 text-sm font-medium ">Hourly Rate</th>
              <th className="p-4 text-sm font-medium ">Join Date</th>
              <th className="p-4 text-sm font-medium ">Identity</th>
             
              <th className="p-4 text-sm font-medium ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee, index) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="p-4 ">{index + 1}</td>
                <td className="p-4 flex items-center space-x-3">
                  <Avatar sx={{ width: 32, height: 32 }}>{employee.name[0]}</Avatar>
                  <span className="">{toTitleCase(employee.name)}</span>
                </td>
                <td className="p-4 ">{toTitleCase(employee.designation)}</td>
                <td className="p-4 ">{employee.contact}</td>
                <td className="p-4 ">{employee.address}</td>
                <td className="p-4 ">{employee.hourly_rate}</td>
                <td className="p-4 ">{employee.join_date}</td>
                <td className="p-4 ">
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
