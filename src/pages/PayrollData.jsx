import React from "react";
import { Switch } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const payrollData = [
  {
    id: 1,
    name: "John Doe",
    totalHours: 160,
    overtimeHours: 10,
    totalPay: 4000,
    advanceDeduction: 500,
    netPay: 3500,
    isPaid: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    totalHours: 150,
    overtimeHours: 5,
    totalPay: 3800,
    advanceDeduction: 300,
    netPay: 3500,
    isPaid: false,
  },
];

const Payroll = () => {
  const handleTogglePaid = (id) => {
    console.log(`Toggled isPaid for employee with ID: ${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Payroll Report</h2>
        </div>
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-sm font-medium text-gray-600">#</th>
              <th className="p-4 text-sm font-medium text-gray-600">Name</th>
              <th className="p-4 text-sm font-medium text-gray-600">Total Hours</th>
              <th className="p-4 text-sm font-medium text-gray-600">Overtime Hours</th>
              <th className="p-4 text-sm font-medium text-gray-600">Total Pay</th>
              <th className="p-4 text-sm font-medium text-gray-600">Advance Deduction</th>
              <th className="p-4 text-sm font-medium text-gray-600">Net Pay</th>
              <th className="p-4 text-sm font-medium text-gray-600">Paid</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((employee, index) => (
              <tr key={employee.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-gray-800">{index + 1}</td>
                <td className="p-4 flex items-center space-x-3">
                  <Avatar sx={{ width: 32, height: 32 }}>{employee.name[0]}</Avatar>
                  <span className="text-gray-800">{employee.name}</span>
                </td>
                <td className="p-4 text-gray-800">{employee.totalHours}</td>
                <td className="p-4 text-gray-800">{employee.overtimeHours}</td>
                <td className="p-4 text-gray-800">${employee.totalPay.toFixed(2)}</td>
                <td className="p-4 text-gray-800">
                  ${employee.advanceDeduction.toFixed(2)}
                </td>
                <td className="p-4 text-gray-800">${employee.netPay.toFixed(2)}</td>
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
    </div>
  );
};

export default Payroll;
