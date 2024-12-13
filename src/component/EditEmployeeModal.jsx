import React, { useState } from "react";
import { Box, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateEmployeeDataById } from "../services/employeeService";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditEmployeeModal = ({ employee, onSave, onClose }) => {
  const { employeeId } = useParams();
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const [identityCard , setIdentityCard] = useState(null);
  const [loading , setLoading] = useState(false);

  const handleChange = (key, value) => {
    setEditedEmployee({ ...editedEmployee, [key]: value });
  };

const handleFileChange = (e) => {
  setIdentityCard(e.target.files[0])
}

  const handleSave = async() => {

    setLoading(true);
    try{
      const updatedEmployee = {...editedEmployee , identityCard};
      const response = await updateEmployeeDataById(employeeId , updatedEmployee);
      toast.success("Employee Updated Successfully");
      onSave(response.data)
      onClose();
    }
    catch(error){
     console.error("Error updating employee Data ", error)
     toast.error("Error updating employee Data")
    }finally{
      setLoading(false);
    }
    
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500,
        bgcolor: "white",
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
      }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 mt-20">Edit Employee</h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <div className="mt-4 space-y-3">
        <TextField
          fullWidth
          label="Name"
          value={editedEmployee.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          fullWidth
          label="Designation"
          value={editedEmployee.designation}
          onChange={(e) => handleChange("designation", e.target.value)}
        />
        <TextField
          fullWidth
          label="Contact"
          value={editedEmployee.contact}
          onChange={(e) => handleChange("contact", e.target.value)}
        />
        <TextField
          fullWidth
          label="Address"
          value={editedEmployee.address}
          onChange={(e) => handleChange("address", e.target.value)}
        />
        <TextField
          fullWidth
          label="Hourly Rate"
          value={editedEmployee.hourly_rate}
          onChange={(e) => handleChange("hourly_rate", e.target.value)}
        />
        <TextField
          fullWidth
          label="Advance Pay"
          value={editedEmployee.advance_pay}
          onChange={(e) => handleChange("advance_pay", e.target.value)}
        />
        <div>
          <label htmlFor="identityCard" className="block text-gray-700 font-medium">
            Identity Card
          </label>
          <input
            id="identityCard"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="mt-2"
          />
        </div>
        <TextField
          fullWidth
          label="Active"
          value={editedEmployee.isActive}
          onChange={(e) => handleChange("isActive", e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </div>
    </Box>
  );
};

export default EditEmployeeModal;
