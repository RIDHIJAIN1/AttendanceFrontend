import React from "react";
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';

const GreetingCard = () => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-bold">Hi, Ritik</h2>
      <p className="text-gray-500">Good Morning</p>
      <p className="text-gray-400 my-4">Have a good day</p>
      <div className=" flex text-center justify-center align-middle">
  
<WbSunnyTwoToneIcon style={{ fontSize: "80px", color: "orange" }} />
      </div>
    </div>
  );
};

export default GreetingCard;
