import React from "react";
import { Box, Button } from "@mui/material";
import { deleteEmployeeDataById } from "../services/employeeService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DeleteEmployeeModal = ({ employeeId, onDelete, onClose }) => {

 const navigate = useNavigate();
   
  const handleDelete = async(employeeId)=>{
    try{
      const result = await deleteEmployeeDataById(employeeId)
      console.log("Employee Deleted Successfully", result)
      toast.success("Employee Deleted Successfully")
      onClose();
      navigate('/employeedetails')
    }catch(error){
      throw error;
    }
  }


  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        bgcolor: "white",
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
      }}
    >
      <h3 className="text-lg text-gray-800">
        Are you sure you want to delete this employee?
      </h3>
      <div className="mt-4 flex justify-end space-x-3">
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleDelete(employeeId)} variant="contained" color="error">
          Delete
        </Button>
      </div>
    </Box>
  );
};

export default DeleteEmployeeModal;
