import React, { useEffect, useMemo, useState } from "react";
import { Switch, TablePagination, TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { IconButton } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { getMonthlyPayRoll, updateMonthlyPayroll } from "../services/payrollServices";
import { getEmployeeData } from "../services/employeeService";
import { toast } from "react-toastify";

const Payroll = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [payrollData, setPayrollData] = useState([]);
   const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());
  
  const filteredData = useMemo(() => {
    return payrollData.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm)
    );
  }, [payrollData, searchTerm]);
  
  
  const paginatedData = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const formattedDate = currentDate.toISOString().slice(0, 7);



  const handleTogglePaid = async (id) => {
    try {
      const updatedPayrollData = payrollData.map((employee) => {
        if (employee.id === id) {
          employee.isPaid = !employee.isPaid;
        }
        return employee;
      });
      setPayrollData([...updatedPayrollData]);
      await updateMonthlyPayroll(id, formattedDate, { isPaid: !employee.isPaid });
    } catch (error) {
      console.error("Error updating isPaid:", error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Array(new Date(year, month + 1, 0).getDate())
      .fill(null)
      .map((_, index) => index + 1);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });



  const handlePaymentChange = (id, value) => {
    const updatedPayrollData = payrollData.map((employee) => {
      if (employee.id === id) {
       const currentMonthPayment = Number(value) || 0;
       const remainingAmt = employee.currentMonthTotal - currentMonthPayment;
 
        return {
        
        ...employee,
        currentMonthPayment,
        remainingAmt
      };
    }
   return employee
  });
    setPayrollData([...updatedPayrollData]);
  };


  const handleUpdatePayment = async (id) => {
    try {
      const employee = payrollData.find((emp) => emp.id === id);
      if (!employee) return;

      const payload = {
        currentMonthPayment: employee.currentMonthPayment,
        remainingAmt: employee.remainingAmt,
      };

      await updateMonthlyPayroll(id, formattedDate, payload);
      toast.success("Payment updated successfully!");
      setTimeout(() => fetchPayrollData(), 2000);

      // fetchPayrollData(); // Fetch data again for consistency
    } catch (error) {
      toast.error("Error updating payment");
      console.error("Error updating payment:", error);
    }
  };

  const fetchPayrollData = async () => {
    try {
      setLoading(true);
      setError(false);
  
      const [employeeData, payrollDataRaw] = await Promise.all([
        getEmployeeData(),
        getMonthlyPayRoll(formattedDate),
      ]);
  
      console.log("Raw Employee Data Response:", employeeData);
      console.log("Raw Payroll Data Response:", payrollDataRaw);
  
      if (!Array.isArray(employeeData)) {
        throw new Error("Unexpected employee data format from API");
      }
  
      // Access the actual payroll array
      const payrollData = payrollDataRaw?.payroll || [];
      if (!Array.isArray(payrollData)) {
        console.warn("Payroll data is invalid or missing. Proceeding with employee data only.");
      }
  
      const formattedData = employeeData.map((employee) => {
        const payrollRecord = payrollData.find(
          (record) => record?.employeeId === employee?._id
        );
  
        return {
          id: employee?._id || "N/A",
          name: employee?.name || "Unknown",
          totalHours: payrollRecord?.totalHours || 0,
          hourlyRate: payrollRecord?.hourlyRate || 0,
          totalAmt: payrollRecord?.totalHours && payrollRecord?.hourlyRate
            ? payrollRecord.totalHours * payrollRecord.hourlyRate
            : 0,
          wages: payrollRecord?.wagesPaid || 0,
          currentMonthTotal: payrollRecord?.currentMonthTotal || 0,
          currentMonthPayment: payrollRecord?.currentMonthPayment || 0,
          remainingAmt: payrollRecord?.remainingAmt || 0,
          isPaid: payrollRecord?.isPaid || false,
        };
      });
  
      console.log("Formatted Data:", formattedData);
      setPayrollData(formattedData);
    } catch (error) {
      console.error("Failed to fetch employee data:", error);
      setError("Failed to fetch payroll data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  useEffect(() => {
    fetchPayrollData();
  }, [formattedDate]);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <IconButton onClick={handlePrevMonth}>
          <ArrowBack />
        </IconButton>
        <h2 className="text-2xl font-bold">{monthYear}</h2>
        <IconButton onClick={handleNextMonth}>
          <ArrowForward />
        </IconButton>
      </div>
      <div className="max-w-7xl mx-aut rounded-lg shadow-lg ">
         
        <div className="p-4 border-b  flex justify-between" >
          <h2 className="text-2xl font-semibold ">
            Payroll Report
          </h2>
          <TextField label="Search" variant="outlined" onChange={handleSearch} />
        </div>
        <div className="overflow-x-auto max-w-sm lg:max-w-full">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-4 text-sm font-medium">#</th>
              <th className="p-4 text-sm font-medium">Name</th>
              <th className="p-4 text-sm font-medium">
                Total Hours
              </th>
              {/* <th className="p-4 text-sm font-medium">Overtime Hours</th> */}
              <th className="p-4 text-sm font-medium">
                {" "}
                Hourly Rate
              </th>

              <th className="p-4 text-sm font-medium">
                 Amt To Be Paid
              </th>
              {/* Total amt will be calculated by multiplying total hrs into hourly rate */}
              <th className="p-4 text-sm font-medium">
                Already Paid
              </th>

              {/* <th className="p-4 text-sm font-medium">
                Current Month Total
              </th> */}
              <th className="p-4 text-sm font-medium">
                {" "}
                Current Payment
              </th>
              <th className="p-4 text-sm font-medium">
                {" "}
                Amount Paid
              </th>
              <th className="p-4 text-sm font-medium">
                Debit/Credit
              </th>

              {/* <th className="p-4 text-sm font-medium">Net Pay</th> */}
              <th className="p-4 text-sm font-medium">Paid</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((employee, index) => (
              <tr key={employee.id} className="border-b hover:cursor-pointer">
                <td className="p-4 "> {page * rowsPerPage + index + 1}</td>
                <td className="p-4 flex items-center space-x-3">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {employee.name[0]}
                  </Avatar>
                  <span className="">{employee.name}</span>
                </td>
                <td className="p-4 ">{employee.totalHours}</td>
                <td className="p-4 ">{employee.hourlyRate}</td>
                <td className="p-4 ">{employee.totalAmt}</td>
                <td className="p-4 ">{employee.wages}</td>
                {/* <td className="p-4 ">
                  {employee.currentMonthTotal}
                </td> */}
                <td className="p-4 ">
                  <input
                    type="number"
                    value={employee.currentMonthPayment}
                    onChange={(e) =>
                      handlePaymentChange(employee.id, e.target.value)
                    }
                    onBlur={() => handleUpdatePayment(employee.id)}
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>
                <td className="p-4 ">{(employee.wages)+ (employee.currentMonthPayment)}</td>
                <td
  className={`p-4 ${
    employee.remainingAmt > 0 ? "text-red-500" : "text-green-500"
  }`}
>
  {Math.abs(employee.remainingAmt) + (employee.remainingAmt == 0 ? "" : employee.remainingAmt > 0 ? " Remaining" : " Extra")}
</td>


                <td className="p-4">
                  <Switch
                    checked={employee.isPaid}
                    onChange={() => handleTogglePaid(employee.id)}
                    color="primary"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

export default Payroll;
