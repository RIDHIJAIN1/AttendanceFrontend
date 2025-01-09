import axios from "axios";
import { APP_URL } from "../config/config";
import axiosInstance from "./axiosInstance";


export const updateMonthlyPayroll = async(employeeId , month , data)=>{
  try{
    const response = await axiosInstance.post(`/payroll/${employeeId}/${month}`,data);
  console.log(response)
      return response
  }
  catch(error){
    console.error('Error Posting payroll:', error);
    throw error;
  }
}


export const getMonthlyPayRoll = async (month) => {
    try {
      const response = await axiosInstance.get(`/payroll?month=${month}`);
      console.log(response.data)
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return []; // No attendance records for the date
      }
      console.error('Error fetching payroll:', error);
      throw error;
    }
  };