import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from "../Navigation";

const Notifications = () => {
   // const navigate = useNavigate();
    return (
        <>
            <Navigation />
            <div style={{ margin: '20px' }}>
                Notifications
            </div>
        </>
    );
}

export default Notifications;
