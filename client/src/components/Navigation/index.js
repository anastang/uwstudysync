import {React, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [ 
  {name: 'Home', path: '/'},
  {name: 'My Courses', path: '/mycourses'},
  {name: 'My Profile', path: '/myprofile'}
];

const Navigation = () => {
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerOpen = event => {
    setDrawerOpen(event);
  };

  const location = useLocation();
  const getPage = (path) => {
    const page = pages.find(page => page.path === path);
    return page ? page.name : 'Page Not Found';
  };

  return (
    <AppBar position="static" elevation='1' sx={{backgroundColor: '#009688'}}>
      <Box sx={{display: 'flex', alignItems: 'center', padding: 0.5}}>
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

        <IconButton
          color="inherit"
          component={Link}
          to={'/myprofile'}
          sx={{marginLeft: 'auto'}}
        >
          <AccountCircle sx={{fontSize: '35px'}} />
        </IconButton>
      </Box>
    </AppBar>
  );
};
export default Navigation;