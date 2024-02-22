import React from 'react';
import {Link} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';

const Navigation = () => {
  return (
    <AppBar position="static">
       <Box sx={{ display: 'flex', alignItems: 'center', padding: 0.5}}>
          <Typography component={Link} to={'/'} sx={{marginLeft: '40px',marginRight: '80px', color: 'inherit',  textDecoration: 'none'}}>
            Home
          </Typography>
          <Typography component={Link} to={'/mycourses'} sx={{color: 'inherit',  textDecoration: 'none'}}>
            My Courses
          </Typography>

          <IconButton color="inherit" component={Link} to={'/myprofile'} sx={{ marginLeft: 'auto' }}>
            <AccountCircle sx={{fontSize:'40px'}}/>
          </IconButton>

      </Box>
    </AppBar>
  );
};
export default Navigation;
