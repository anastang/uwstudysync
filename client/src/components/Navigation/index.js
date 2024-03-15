import {React, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const pages = [ 
  {name: 'Home', path: '/'},
  {name: 'My Courses', path: '/mycourses'},
  {name: 'My Profile', path: '/myprofile'},
  {name: 'Notifications', path: '/notifications'},
  {name: 'Sign In', path: '/signin'},
  {name: 'Sign Up', path: '/signup'},

];

const Navigation = () => {
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleDrawerOpen = event => {
    setDrawerOpen(event);
  };

  const location = useLocation();
  const getPage = (path) => {
    const page = pages.find(page => page.path === path);
    return page ? page.name : '';
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="static" elevation='1' sx={{backgroundColor: '#161d20', borderBottom: '1px solid black'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 2}}>
        {/* Left Section */}
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon sx={{fontSize: '30px'}} />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => handleDrawerOpen(false)}
            onClick={() => handleDrawerOpen(false)}
            sx={{'& .MuiDrawer-paper': {width: '250px'}}}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {pages.map((page) => (
                <Typography
                  component={Link}
                  to={page.path}
                  sx={{marginTop: 4, fontWeight: 700, color: 'inherit', textDecoration: 'none'}}
                >
                  {page.name}
                </Typography>
              ))}
            </Box>
          </Drawer>
  
          {/* Typography for Page Title */}
          <Typography sx={{fontWeight: 700, paddingLeft: 1}}>{getPage(location.pathname)}</Typography>
        </Box>
  
        {/* Middle Section (StudySync) */}
        <Box sx={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
          <Typography variant="h6">
            StudySync
          </Typography>
        </Box>
  
        {/* Right Section */}
        <IconButton
          color="inherit"
          component={Link}
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
        >
          <AccountCircle sx={{fontSize: '35px'}} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to={'/myprofile'} onClick={handleMenuClose}>
            My Profile
          </MenuItem>
          <MenuItem component={Link} to={'/notifications'} onClick={handleMenuClose}>
            Notifications
          </MenuItem>
          <MenuItem component={Link} to={'/signin'} onClick={handleMenuClose}>
            Sign In
          </MenuItem>
        </Menu>
      </Box>
    </AppBar>
  );
  
};
export default Navigation;