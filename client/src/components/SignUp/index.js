import React from 'react';
import { Button, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navigation from "../Navigation";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/config';

const defaultTheme = createTheme();

const SignUp = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
        email: data.get('email'),
        password: data.get('password'),
    };
    
    // Perform password length validation
    if (userData.password.length < 6) {
        console.error('Password must be at least 6 characters long');
        alert('Password must be at least 6 characters long');
        return; // Exit the function if password is invalid
    }

    try {
        // Create a fetch request to server's /api/register endpoint
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        // Check if the response is successful
        if (response.ok) {
            // If registration is successful, proceed with Firebase registration
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                data.get('email'),
                data.get('password')
            );
            const user = userCredential.user;
            console.log('User registered successfully:', user);
            navigate('/'); // Redirect to home after sign-up
        } else {
            // If registration fails, display an error message
            const errorData = await response.json();
            console.error('Failed to register user:', errorData.message);
            alert('Failed to register user: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error during registration:', error.message);
        alert('Error during registration: ' + error.message);
    }
};

  const handleSignInClick = () => {
    navigate('/signin'); // Redirect to sign-in page
  };

  return (
    <>
      <Navigation />
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <MuiLink onClick={handleSignInClick} variant="body2">
                    Already have an account? Sign in
                  </MuiLink>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default SignUp;
