import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from "../Navigation";

const SignIn = () => {
   // const navigate = useNavigate();
    return (
        <>
            <Navigation />
            <div style={{ margin: '20px' }}>
                Sign In
            </div>
        </>
    );
}

export default SignIn;
