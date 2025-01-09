import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const CalendarCard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate(); // Initialize useNavigate
  
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getDaysInMonth = (month, year) => {
    return new Array(32 - new Date(year, month, 32).getDate())
      .fill(0)
      .map((_, i) => i + 1);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };

  const handleDayClick = (day) => {
    if (day) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth(); // Zero-indexed
  
      // Create a date in UTC
      const selectedDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      console.log(formattedDate); // Debugging line
      navigate(`/attendance?date=${formattedDate}`); // Navigate to AttendanceTable with date
    }
  };

  const renderCalendarCardDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    
    const emptySlots = new Array(firstDayOfMonth).fill(null);
    
    return [...emptySlots, ...daysInMonth].map((day, index) => (
      <div
        key={index}
        className={`p-2 border rounded-lg ${day ? "cursor-pointer" : ""}`}
        onClick={() => handleDayClick(day)}
      >
        {day}
      </div>
    ));
  };

  return (
    <div className="w-full max-w-sm mx-auto border-white border-2 p-4 rounded-lg shadow-md">
      <div className="flex justify-between mb-4">
        <button onClick={handlePreviousMonth}>
          &lt;
        </button>
        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4 text-center font-bold hover:bg-gray-400">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarCardDays()}
      </div>
    </div>
  );
};

export default CalendarCard;
