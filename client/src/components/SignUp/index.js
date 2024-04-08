import React, { useState } from 'react';
import {withFirebase} from '../Firebase';
import {Grid, TextField, Typography, Button} from '@mui/material'
import Navigation from '../Navigation/index'
import {Link, useNavigate} from 'react-router-dom';

const SignUp = ({ firebase, authenticated, authUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const callApiRegisterUser = async (id) => {
    const url = `/api/registerUser`;
    const user = {
      id,
      email,
      password,
      username
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      });
      const body = await response.json();
      if (response.status !== 200) {
        throw Error(body.message || 'Error registering user');
      }
      return body;
    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    firebase
    .doCreateUserWithEmailAndPassword(email, password)
    .then(async authUser => {
      const id = authUser.user.uid;        
      await callApiRegisterUser(id);
      setUsername('');
      setEmail('');
      setPassword('');
      setError(null);
      navigate("/");
    }).catch(error => {
      console.log(error);
      setError("Error");
    });
  };

  const onNameChange = (event) => {
    setUsername(event.target.value);
    setError(null);
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
    setError(null);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  if (authUser) { 
    return (
      <>
        Already signed in
      </>
    )
  }
  return (
    <>
      <Navigation/>
      <Grid container align="center" paddingTop={10}>
        <Grid item xs={12} sx={{padding: 1}}>
            <Typography variant="h5">
              Sign Up
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <TextField
              variant="outlined"
              required
              label="Username"
              onChange={(event) => onNameChange(event)}
              sx={{width: "400px"}}
            />
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <TextField
              variant="outlined"
              required
              label="Email Address"
              onChange={(event) => onEmailChange(event)}
              sx={{width: "400px"}}
            />
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <TextField
              variant="outlined"
              required
              label="Password"
              type="password"
              onChange={(event) => onPasswordChange(event)}
              sx={{width: "400px"}}
            />
        </Grid>
        {error && (
          <Grid item xs={12} sx={{padding: 1}}>
              <Typography color="error" style={{ textAlign: 'center' }}>
                Please fill in all fields
              </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{padding: 1}}>
          <Link to={"/signin"}>
            Already have an account? Click here to sign in
          </Link>
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <Button
              variant="contained"
              sx={{ width: "400px" }}
              onClick={(event) => (onSubmit(event))}
            >
              Sign Up
            </Button>
        </Grid>
      </Grid>
    </>
  );
}

export default withFirebase(SignUp);
