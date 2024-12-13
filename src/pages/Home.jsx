import React from "react";
import GreetingCard from "../component/GreetingCard";
import EmployeeCount from "../component/EmployeeCount";
import CalendarCard from "../component/CalendarCard";
import AttendanceCard from "../component/AttendanceCard";
import AttendanceChart from "../component/AttendanceChart";

const Home = () => {
  return (
    <div className="w-full p-5">
      <div className="container mx-auto px-0">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Attendance */}
          <AttendanceCard />

          {/* Greeting */}
          <GreetingCard />

          {/* Quick Status */}
          <EmployeeCount />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Calendar */}
          <CalendarCard />

          {/* Attendance Chart */}
          <AttendanceChart />
        </div>
      </div>
    </div>
  );
};

export default Home;
