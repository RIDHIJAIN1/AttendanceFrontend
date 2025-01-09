import React, { useState } from "react";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { addEmployee } from "../features/employee/employeeSlice";
import { toast } from "react-toastify";
import { addEmployeeData } from "../services/employeeService";

const EmployeeForm = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: "",
    designation: "",
    contact: "",
    identityCard: null,
    address: "",
    hourlyRate: "",
    join_date: null,
  });

  const toTitleCase = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "designation") {
      setEmployeeData({
        ...employeeData,
        [name]: toTitleCase(value),
      });
    } else {
      setEmployeeData({ ...employeeData, [name]: value });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEmployeeData({ ...employeeData, identityCard: file });
    }
  };

  const handleDateChange = (date) => {
    setEmployeeData({ ...employeeData, join_date: date });
  };

  const validateForm = () => {
    const contactPattern = /^\d{10}$/;
    if (!employeeData.name || !employeeData.designation || !employeeData.join_date) {
      toast.error("Please fill in all the required fields");
      return false;
    }
    if (!contactPattern.test(employeeData.contact)) {
      toast.error("Please enter a valid 10-digit contact number");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const response = await addEmployeeData(employeeData);
      console.log("Employee Data:", response.data);
      dispatch(addEmployee(response.data));
      toast.success("Employee Added Successfully");
      setEmployeeData({
        name: "",
        designation: "",
        contact: "",
        identityCard: null,
        address: "",
        hourlyRate: "",
        join_date: null,
      });
      handleClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error adding employee", error);
      toast.error("Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Name"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Designation"
              name="designation"
              value={employeeData.designation}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Contact"
              name="contact"
              value={employeeData.contact}
              onChange={handleChange}
              fullWidth
              type="tel"
            />
              <TextField
              label="Hourly Rate ($)"
              name="hourlyRate"
              value={employeeData.hourlyRate}
              onChange={handleChange}
              fullWidth
              type="number"
            />
            
            <TextField
              label="Address"
              name="address"
              value={employeeData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          
          <div className="text-left">
              <p>Identity Card</p>
              <input
                type="file"
                id="identityCard"
                name="identityCard"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4 border-gray-400 border p-2 cursor-pointer rounded-md w-64"
              />
            </div>
            <DatePicker
              label="Join Date"
              value={employeeData.join_date}
              required
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </form>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Employee"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;