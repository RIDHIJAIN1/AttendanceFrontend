import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

const AttendanceCard = () => {
 const [currentTime , setCurrentTime] = useState(new Date());

 useEffect(()=>{
  const intervalId = setInterval(()=>{
    setCurrentTime(new Date())
  },1000)
  
  return ()=>{
    clearInterval(intervalId)

 }})

 const formattedDate = currentTime.toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center ">
      <h2 className="text-xl font-bold mb-4">Date & Time</h2>
      <div className="relative w-24 h-24">
        <CircularProgress
          variant="determinate"
          value={70}
          className="text-orange-500"
          size={96}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-bold">{formattedDate}</p>
           
          </div>
        </div>
      </div>
      <div className=" w-full mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Time</p>
          <p className="text-lg font-semibold">{formattedTime}</p>
        </div>
   
      </div>
   
    </div>
  );
};

export default AttendanceCard;
