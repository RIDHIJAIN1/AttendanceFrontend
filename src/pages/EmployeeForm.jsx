import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { addEmployee } from "../features/employee/employeeSlice";
import { toast } from "react-toastify";
import { addEmployeeData } from "../services/employeeService";

const EmployeeForm = () => {
  const dispatch = useDispatch();
  const [loading , setLoading]= useState(false) // Ensure you have this line to use dispatch
  const [employeeData, setEmployeeData] = useState({
    name: "",
    designation: "",
    contact: "",
    identityCard: null,
    address: "",
    hourlyRate: "",
    advancePay: "",
    join_date: null,
  });

  const toTitleCase = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  };
 // Handle text input changes
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

  // Handle date picker changes
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


  // Handle form submission
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
        advancePay: "",
        joinDate: null,
      });
    } catch (error) {
      console.error("Error adding employee", error);
      toast.error("Error adding employee");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="w-11/12 mx-auto  bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Employee
        </h2>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <TextField
            label="Name"
            name="name"
            value={employeeData.name}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Designation */}
          <TextField
            label="Designation"
            name="designation"
            value={employeeData.designation}
            onChange={handleChange}
            fullWidth
            required
          />

          {/* Contact */}
          <TextField
            label="Contact"
            name="contact"
            value={employeeData.contact}
            onChange={handleChange}
            fullWidth
           
            type="tel"
          />

          <div className="text-left">
            <p>Identity Card</p>
            <input
              type="file"
              id="identityCard"
              name="identityCard"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4 border-gray-400 border p-2 cursor-pointer rounded-md"
            />
          </div>

          {/* Address */}
          <TextField
            label="Address"
            name="address"
            value={employeeData.address}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          {/* Hourly Rate */}
          <TextField
            label="Hourly Rate ($)"
            name="hourlyRate"
            value={employeeData.hourlyRate}
            onChange={handleChange}
            fullWidth
            type="number"
          />

          {/* Advance Pay */}
          <TextField
            label="Advance Pay ($)"
            name="advancePay"
            value={employeeData.advancePay}
            onChange={handleChange}
            fullWidth
            type="number"
          />

          {/* Join Date */}
          <DatePicker
            label="Join Date"
            value={employeeData.join_date}
            required
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </form>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Save Employee
          </Button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default EmployeeForm;
