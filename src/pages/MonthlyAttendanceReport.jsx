import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { getEmployeeData } from "../services/employeeService";
import { getMonthlyAttendance } from "../services/attendanceService";

const MonthlyAttendanceReport = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeData , setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch employee and attendance data on component mount
  useEffect(() => {
    fetchAttendanceDetails();
  }, [currentDate]);

  const fetchAttendanceDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const month = currentDate.getMonth() + 1; // Adjust for 0-based index
      const year = currentDate.getFullYear();
  
      const [employeeData, attendanceData] = await Promise.all([
        getEmployeeData(),
        getMonthlyAttendance(month, year),
      ]);
  
      const attendanceRecords = attendanceData.attendance;
  
      // Map attendance data with all employees
      const formattedData = employeeData.map((employee) => {
        const employeeAttendance = {};
        const attendanceRecord = attendanceRecords.find(
          (record) => record.employeeId === employee._id
        );
  
        // Populate attendance if record exists
        if (attendanceRecord && attendanceRecord.dailyRecords) {
          Object.entries(attendanceRecord.dailyRecords).forEach(([dateKey, record]) => {
            employeeAttendance[dateKey] = {
              isPresent: record.isPresent,
              wages: record.wages || 0, // Include wages for each date
            };
          });
        }
  
        return {
          id: employee._id,
          name: employee.name,
          attendance: employeeAttendance,
        };
      });
  
      setAttendanceData(formattedData);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setError("Failed to fetch employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Array(new Date(year, month + 1, 0).getDate()).fill(null).map((_, index) => index + 1);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="p-6 rounded-lg shadow-md ml-auto">
      <div className="flex justify-between items-center mb-4">
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <h2 className="text-2xl font-bold">{monthYear}</h2>
        <IconButton onClick={handleNextMonth}>
          <ArrowForward />
        </IconButton>
      </div>
      <div className="overflow-auto">
        <table className="w-11/12 border-collapse border text-center">
          <thead>
            <tr>
              <th className="sticky top-0  border px-4 py-2">Employee</th>
              {daysInMonth.map((day) => (
                <th key={day} className="sticky top-0  border px-4 py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
  {attendanceData.length > 0 ? (
    attendanceData.map((employee) => (
      <tr key={employee.id}>
        <td className="border px-4 py-2 font-medium">{employee.name}</td>
        {daysInMonth.map((day) => {
          const dateKey = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const attendanceRecord = employee.attendance[dateKey];
          const isPresent = attendanceRecord?.isPresent;
          const wages = attendanceRecord?.wages || 0;

          return (
            <td
              key={day}
              className={`border px-2 py-1 ${
                isPresent === undefined
                  ? "bg-none"
                  : isPresent
                  ? "bg-green-200 text-center text-black"
                  : "bg-red-200 text-center"
              }`}
            >
              {isPresent === undefined ? "❌" : isPresent ? "✔️" : "❌"}
              <p className="mt-1 text-sm font-semibold">{wages}</p>
            </td>
          );
        })}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={daysInMonth.length + 1} className="text-center py-4">
        No data available for this month.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default MonthlyAttendanceReport;
