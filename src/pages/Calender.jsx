import React from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'rsuite';
import 'rsuite/Calendar/styles/index.css';

const Calender = () => {
    const navigate = useNavigate();

    const handleDateSelect = (date) => {
        if (date) {
            const formattedDate = date.toLocaleDateString(); // Format the date as needed
            navigate(`/today?date=${formattedDate}`);
        }
    };

    return (
        <Container>
            <div className='block w-full'> 
                <Calendar onSelect={handleDateSelect} /> 
            </div> 
        </Container>
    );
};

export default Calender;