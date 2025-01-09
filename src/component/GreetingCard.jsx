import React from "react";
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';

const GreetingCard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 16) {
      return "Good Afternoon";
    } else if (hour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  const greeting = getGreeting();

  return (
    <div className="border-white border-2 p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold">Hi, Ritik</h2>
      <p>{greeting}</p>
      <p className="my-4">Have a good day</p>
      <div className="flex text-center justify-center align-middle">
        <WbSunnyTwoToneIcon style={{ fontSize: "80px", color: "orange" }} />
      </div>
    </div>
  );
};

export default GreetingCard;
