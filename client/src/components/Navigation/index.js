import {React, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const pages = [ 
  {name: 'Home', path: '/'},
  {name: 'My Courses', path: '/mycourses'},
  {name: 'My Profile', path: '/myprofile'}
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
    <AppBar position="static" elevation='1' sx={{backgroundColor: '#009688'}}>
      <Box sx={{display: 'flex', alignItems: 'center', paddingTop: 0.5}}>
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

        <Typography sx={{fontWeight: 700, paddingX: 4}}>{getPage(location.pathname)}</Typography>
        {/* <Box sx={{marginLeft: '1375px'}}>
          <Button variant="outlined" component={Link} to={'/signin'}>Sign In</Button>
        </Box> */}

        <IconButton
          color="inherit"
          component={Link}
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          // to={'/myprofile'}
          onClick={handleProfileMenuOpen}
          sx={{marginLeft: 'auto'}}
        >
        <AccountCircle sx={{fontSize: '35px'}} />
        </IconButton>
        {/* <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
          <MenuItem component={Link} to={'/myprofile'} onClick={handleMenuClose}>
            My Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Notifications</MenuItem>
          <MenuItem component={Link} to={'/notifications'} onClick={handleMenuClose}>
            Notifications
          </MenuItem>
          <MenuItem component={Link} to={'/signin'} onClick={handleMenuClose}>
            Sign In
          </MenuItem>
        </Menu> 
        */}

      </Box>
    </AppBar>
  );
};
export default Navigation;