import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from "../Navigation";

const MyPosts = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navigation />
            <div style={{ margin: '20px' }}>
                <h1>My Posts</h1>
                <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
            </div>
        </>
    );
}

export default MyPosts;