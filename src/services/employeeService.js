// import EmployeeData from "../pages/EmployeeData";

import axios from "axios";
import { useParams } from "react-router-dom";
import { APP_URL } from "../config/config";
import { auth } from "../config/firebase";
import axiosInstance from "./axiosInstance";

export const addEmployeeData = async (employeeData) => {
  const formData = new FormData();
  for (const key in employeeData) {
    if (key === "identityCard") {
      // Special handling for file
      formData.append(key, employeeData[key]); // File can be appended directly
    } else if (key === "join_date") {
      // Convert date object to ISO string
      formData.append(
        key,
        employeeData[key] ? employeeData[key].toISOString() : ""
      );
    } else {
      // Append other fields as strings
      formData.append(key, employeeData[key] ?? "");
    }
  }
  try {
    const response = await axiosInstance.post(`/employee`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding Employee Data:", error);
    throw error;
  }
};

export const getEmployeeData = async () => {
  try {
    const response = await axiosInstance.get(`/employee`);
    return response.data.employees;
  } catch (error) {
    console.error("Error fetching Employee Data");
    return [];
  }
};
export const getEmployeeCount = async () => {
  try {
    const response = await axiosInstance.get(`/employee`);
    return response.data.totalEmployees;
  } catch (error) {
    console.error("Error fetching Employee Data");
    return [];
  }
};


export const getEmployeeDataById = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`/employees/${employeeId}`);
    return response.data; // Axios stores the response data in `data` property
  } catch (error) {
    console.error("Error fetching Employee Data:", error);
    throw error; // Let the component handle the error
  }
};

export const deleteEmployeeDataById = async (employeeId) => {
  try {
    const response = await axiosInstance.delete(`/employee/${employeeId}`);

    return response.data; // Axios stores the response data in `data` property
  } catch (error) {
    console.error("Error deleting Employee Data:", error);
    throw error; // Let the component handle the error
  }
};

export const updateEmployeeDataById = async (employeeId, updatedEmployee) => {
  const formData = new FormData();

  for (const key in updatedEmployee) {
    if (key === "identityCard" && updatedEmployee[key]) {
      formData.append(key, updatedEmployee[key]); // File handling
    } else {
      formData.append(key, updatedEmployee[key] ?? "");
    }
  }
  try {
    const response = await axiosInstance.put(
      `/employee/${employeeId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Axios stores the response data in `data` property
  } catch (error) {
    console.error("Error fetching Employee Data:", error);
    throw error; // Let the component handle the error
  }
};
