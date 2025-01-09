import axios from "axios"
import { APP_URL } from "../config/config"
import axiosInstance from "./axiosInstance"

export const markAttendance=async(employeeId , attendanceData)=>{
try{
    const response = await axiosInstance.post(`/attendance/${employeeId}`, attendanceData)
    console.log(response)
    return response;
}catch(err){
    console.log(err)
}
}

export const getAttendance = async (date) => {
    try {
      const response = await axiosInstance.get(`/attendance?date=${date}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return []; // No attendance records for the date
      }
      console.error('Error fetching attendance:', error);
      throw error;
    }
  };
export const getMonthlyAttendance = async (month , year) => {
    try {
      const response = await axiosInstance.get(`/monthlyattendance?month=${month}&year=${year}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return []; // No attendance records for the date
      }
      console.error('Error fetching attendance:', error);
      throw error;
    }
  };

export const updateAttendance=async(employeeId , attendanceData)=>{
    try{
        const response = await axiosInstance.put(`/attendance/${employeeId}`, attendanceData 
        );
        console.log(response)
        return response;
    }catch(err){
        console.log(err)
    }
    }

    export const deleteAttendance=async(employeeId)=>{
        try{
            const response = await axiosInstance.delete(`/attendance/${employeeId}`)
            console.log(response)
            return response;
        }catch(err){
            console.log(err)
        }
        }