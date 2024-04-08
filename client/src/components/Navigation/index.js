import {React, useState, useEffect, useContext} from 'react';
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
import {FirebaseContext} from '../Firebase';

const Navigation = () => {

  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext); 
  
  useEffect(() => {
    if (firebase) {
      const listener = firebase.auth.onAuthStateChanged(user => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      return () => listener();
    }
  }, [firebase]);

  const pages = [ 
    {name: 'Home', path: '/'},
    {name: 'My Courses', path: '/mycourses'},
    {name: 'My Profile', path: '/myprofile'},
    authUser ? {} : {name: 'Sign In', path: '/signin'},
    authUser ? {} : {name: 'Sign Up', path: '/signup'},
  ];

  const location = useLocation();
  const getPage = (path) => {
    const page = pages.find(page => page.path === path);
    return page ? page.name : '';
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSignOut = () => {
    firebase
    .doSignOut()
    .then(() => {
      window.location.reload();
    })
    .catch(error => console.error('Sign out error:', error));
  };

  return (
    <AppBar position="static" elevation='1' sx={{backgroundColor: '#161d20', borderBottom: '1px solid black'}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingX: 2}}>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <IconButton color="inherit" onClick={event => {setDrawerOpen(event)}}>
            <MenuIcon sx={{fontSize: '30px'}} />
          </IconButton>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onClick={() => setDrawerOpen(false)}
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
  
        <IconButton
          color="inherit"
          component={Link}
          onClick={(event) => {setAnchorEl(event.currentTarget)}}
        >
          <AccountCircle sx={{fontSize: '35px'}} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={() => {setAnchorEl(null)}}
        >
          {authUser ?
            <>
              <MenuItem component={Link} to={'/myprofile'} onClick={() => {setAnchorEl(null)}}>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => {handleSignOut()}}>
                Sign Out
              </MenuItem>
            </>
          :
            <>
              <MenuItem component={Link} to={'/signin'} onClick={() => {setAnchorEl(null)}}>
                Sign In
              </MenuItem>
              <MenuItem component={Link} to={'/signup'} onClick={() => {setAnchorEl(null)}}>
                Sign Up
              </MenuItem>
            </>
          }
        </Menu>
      </Box>
    </AppBar>
  );
};

export default Navigation;