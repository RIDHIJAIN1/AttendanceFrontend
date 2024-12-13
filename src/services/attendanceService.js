import axios from "axios"
import { APP_URL } from "../config/config"

export const markAttendance=async(employeeId , attendanceData)=>{
try{
    const response = await axios.post(`${APP_URL}/attendance/${employeeId}`, attendanceData , {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(response)
    return response;
}catch(err){
    console.log(err)
}
}

export const getAttendance = async (date) => {
    try {
      const response = await axios.get(`http://localhost:3002/attendance?date=${date}`);
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
      const response = await axios.get(`http://localhost:3002/monthlyattendance?month=${month}&year=${year}`);
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
        const response = await axios.put(`${APP_URL}/attendance/${employeeId}`, attendanceData , {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        return response;
    }catch(err){
        console.log(err)
    }
    }

    export const deleteAttendance=async(employeeId)=>{
        try{
            const response = await axios.delete(`${APP_URL}/attendance/${employeeId}`)
            console.log(response)
            return response;
        }catch(err){
            console.log(err)
        }
        }