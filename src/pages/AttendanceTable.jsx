import React, { useState, useEffect, useMemo } from "react";
import {
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { getEmployeeData } from "../services/employeeService";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { getAttendance, updateAttendance } from "../services/attendanceService";
import { useNavigate } from "react-router-dom";

const AttendanceTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [date, setDate] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const dateParam = searchParams.get("date");
    return dateParam ? new Date(dateParam).toISOString() : new Date().toISOString();
  });

  const navigate = useNavigate();

  const handleClick=()=>{
    navigate(-1);
  }

  const fetchEmployeeDetails = async () => {
    try {
      const [employees, attendanceData] = await Promise.all([
        getEmployeeData(),
        getAttendance(date),
      ]);

      const attendance = attendanceData.docs || [];
  
      // Map MongoDB data to the format expected by the component
      const formattedData = employees.map((employee) => {
        console.log(attendance)
        const attendanceEntry = attendance.find(
          (record) => record.employeeId._id=== employee._id
        );
  
        return {
          id: employee._id,
          name: employee.name,
          isPresent: attendanceEntry?.isPresent || false,
          checkIn: attendanceEntry?.checkIn || "",
          checkOut: attendanceEntry?.checkOut || "",
          totalHours: attendanceEntry?.totalHours || 0,
          dailyWages: attendanceEntry?.dailyWages || 0,
        };
      });
      console.log(formattedData)
      setAttendanceData(formattedData);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      setError("Failed to fetch employee data. Please try again.");
    }
  };
  
  useEffect(() => {
    fetchEmployeeDetails();
  }, [date]);

  const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());

  const filteredAttendance = useMemo(() => {
    return attendanceData.length > 0
      ? attendanceData.filter((employee) =>
          employee.name.toLowerCase().includes(searchTerm)
        )
      : [];
  }, [attendanceData, searchTerm]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateFieldAndBackend = async (id, updatedFields) => {
    const updatedData = attendanceData.map((entry) =>
      entry.id === id ? { ...entry, ...updatedFields } : entry
    );
    setAttendanceData(updatedData);

    const updatedEntry = updatedData.find((entry) => entry.id === id);
    if (updatedEntry) {
      const payload = {
        id: updatedEntry.id,
        date: date.split("T")[0],
        isPresent: updatedEntry.isPresent,
        checkIn: updatedEntry.checkIn || null,
        checkOut: updatedEntry.checkOut || null,
        totalHours: updatedEntry.totalHours,
        dailyWages: updatedEntry.dailyWages,
      };

      try {
        await updateAttendance(id, payload);
      } catch (error) {
        console.error("Error updating attendance:", error);
        setError("Error updating attendance. Please try again.");
      }
    }
  };

  const toggleAttendanceType = (id) => {
    const entry = attendanceData.find((entry) => entry.id === id);
    if (!entry) return;

    const updatedFields = {
      isPresent: !entry.isPresent,
      checkIn: entry.isPresent ? "" : entry.checkIn,
      checkOut: entry.isPresent ? "" : entry.checkOut,
      totalHours: 0,
      dailyWages: 0,
    };

    updateFieldAndBackend(id, updatedFields);
  };

  const handleTimeChange = (id, field, value) => {
    const entry = attendanceData.find((entry) => entry.id === id);
    if (!entry) return;

    const updatedEntry = { ...entry, [field]: value };

    if (updatedEntry.checkIn && updatedEntry.checkOut) {
      const checkInTime = new Date(`1970-01-01T${updatedEntry.checkIn}:00`);
      const checkOutTime = new Date(`1970-01-01T${updatedEntry.checkOut}:00`);
      const diff = (checkOutTime - checkInTime) / (1000 * 60 * 60);

      if (diff <= 0) {
        alert("Check-out time must be after Check-in time.");
        updatedEntry.checkIn = "";
        updatedEntry.checkOut = "";
      } else {
        updatedEntry.totalHours = diff;
      }
    }

    updateFieldAndBackend(id, updatedEntry);
  };

  const handleWagesChange = (id, value) => {
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid positive number for wages.");
      return;
    }
    updateFieldAndBackend(id, { dailyWages: value });
  };

  return (
    <div className="w-11/12 mx-auto p-4">
       <div className="flex m-0 p-0 cursor-pointer "onClick={handleClick}>
        <div >
      <ArrowLeftIcon className="p-0 m-0"/>
      </div>
      <div className="m-0">
       Back
       </div>
      </div>
      <div className="flex justify-between mb-4">
     
        <h2 className="text-2xl font-bold">
          Attendance - <span className="font-light">{date.split("T")[0]}</span>
        </h2>
        <div>Total Records: {filteredAttendance.length}</div>
        <TextField label="Search" variant="outlined" onChange={handleSearch} />
      </div>
      <TableContainer className="bg-white shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Daily Wages</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              filteredAttendance
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>
                      <Switch
                        checked={entry.isPresent}
                        onChange={() => toggleAttendanceType(entry.id)}
                        color="primary"
                      />
                      {entry.isPresent ? "Present" : "Absent"}
                    </TableCell>
                    <TableCell>
                      {entry.isPresent && (
                        <TextField
                          type="time"
                          value={entry.checkIn}
                          onChange={(e) =>
                            handleTimeChange(entry.id, "checkIn", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.isPresent && (
                        <TextField
                          type="time"
                          value={entry.checkOut}
                          onChange={(e) =>
                            handleTimeChange(entry.id, "checkOut", e.target.value)
                          }
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.isPresent ? entry.totalHours : "-"}
                    </TableCell>
                    <TableCell>
                      <TextField
                        className="w-20"
                        value={entry.dailyWages}
                        onChange={(e) =>
                          handleWagesChange(entry.id, e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAttendance.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AttendanceTable;
