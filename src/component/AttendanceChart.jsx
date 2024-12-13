import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AttendanceChart = () => {
  // Data for the bar chart (Departments)
  const barChartData = {
    labels: ['HR', 'Sales', 'Marketing', 'IT', 'Finance', 'R&D', 'P&D', 'Legal', 'Customer Support'],
    datasets: [
      {
        label: 'Number of Persons',
        data: [60, 45, 35, 200, 50, 30, 15, 40, 20],
        backgroundColor: 'rgba(34,197,94, 0.6)', // Tailwind green color
        borderColor: 'rgba(34,197,94, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the pie chart (Gender Distribution)
  const pieChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [106, 54], // Replace with dynamic data
        backgroundColor: ['#34D399', '#F87171'], // Green for Male, Red for Female
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className=" space-y-6 bg-white rounded-lg shadow-md">
      {/* Bar chart (Departments) */}
      <div className="w-full h-full">
       
        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: true }} />
        <h3 className="text-xl font-semibold mb-4">Daily Attendance Data</h3>
      </div>
     
      {/* Pie chart (Gender Distribution) */}
      {/* <div className="w-full">
        <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: true }} />
      </div> */}
    </div>
  );
};

export default AttendanceChart;
