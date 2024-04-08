import React, {useState} from 'react';
import {withFirebase} from '../Firebase';
import {useNavigate} from 'react-router-dom';
import {Grid, TextField, Typography, Button} from '@mui/material'
import Navigation from '../Navigation/index'
import { Link } from 'react-router-dom';

const SignIn = ({firebase, authenticated, authUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const onSubmit = event => {
    event.preventDefault();
    firebase
    .doSignInWithEmailAndPassword(email, password)
    .then(() => {
      navigate('/');
    })
    .catch(error => {
      setError(error);
    });
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
      <Navigation />
      <Grid container align="center" paddingTop={10}>
        <Grid item xs={12} sx={{padding: 1}}>
            <Typography variant="h5">
              Sign In
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <TextField
              variant="outlined"
              required
              label="Email Address"
              onChange={(event) => (onEmailChange(event))}
              sx={{width: "400px"}}
            />
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <TextField
              variant="outlined"
              required
              label="Password"
              type="password"
              onChange={(event) => (onPasswordChange(event))}
              sx={{width: "400px"}}
            />
        </Grid>
        {error && (
          <Grid item xs={12} sx={{padding: 1}}>
              <Typography color="error" style={{ textAlign: 'center' }}>
                Invalid email or password
              </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{padding: 1}}>
          <Link to={"/signup"}>
            Don't have an account? Click here to sign up
          </Link>
        </Grid>
        <Grid item xs={12} sx={{padding: 1}}>
            <Button
              variant="contained"
              sx={{ width: "400px" }}
              onClick={(event) => (onSubmit(event))}
            >
              Sign In
            </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default withFirebase(SignIn);