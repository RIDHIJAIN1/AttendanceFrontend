// import EmployeeData from "../pages/EmployeeData";

import axios from "axios";
import { useParams } from "react-router-dom";
import { APP_URL } from "../config/config";


export const addEmployeeData= async(employeeData)=>{
    const formData = new FormData();
    for(const key in employeeData){
        if (key === "identityCard") {
            // Special handling for file
            formData.append(key, employeeData[key]); // File can be appended directly
          } else if (key === "join_date") {
            // Convert date object to ISO string
            formData.append(key, employeeData[key] ? employeeData[key].toISOString() : "");
          } else {
            // Append other fields as strings
            formData.append(key, employeeData[key] ?? "");
          }
    }
    return await axios.post(`${APP_URL}/employee` , formData,{
        headers:{
          'Content-Type': 'multipart/form-data'
        },
      } );
};

export const getEmployeeData = async()=>{
    try{
    const response =await axios.get(`${APP_URL}/employee`,{
       headers:{
        'Content-Type': 'application/json'
       }
    })
 
 return response.data.employees
} 
  catch(error){
    console.error('Error fetching Employee Data');
    return [];
  }
}
export const getEmployeeDataById = async (employeeId) => {
    const API_URL = `${APP_URL}/employees/${employeeId}`;
    try {
        const response = await axios.get(API_URL);
     
        return response.data; // Axios stores the response data in `data` property
    } catch (error) {
        console.error("Error fetching Employee Data:", error);
        throw error; // Let the component handle the error
    }
};

export const deleteEmployeeDataById = async (employeeId) => {
    const API_URL = `${APP_URL}/employee/${employeeId}`;
    try {
        const response = await axios.delete(API_URL);
     
        return response.data; // Axios stores the response data in `data` property
    } catch (error) {
        console.error("Error deleting Employee Data:", error);
        throw error; // Let the component handle the error
    }
};

export const updateEmployeeDataById = async (employeeId , updatedEmployee) => {
   const formData = new FormData();

   for (const key in updatedEmployee) {
    if (key === "identityCard" && updatedEmployee[key]) {
      formData.append(key, updatedEmployee[key]); // File handling
    } else {
      formData.append(key, updatedEmployee[key] ?? "");
    }
  }
    const API_URL = `${APP_URL}/employee/${employeeId}`;
    try {
        const response = await axios.put(API_URL , formData ,{
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      
        return response.data; // Axios stores the response data in `data` property
  
    } catch (error) {
        console.error("Error fetching Employee Data:", error);
        throw error; // Let the component handle the error
    }
};