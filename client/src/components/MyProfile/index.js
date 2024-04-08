import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import { Grid, TextField, Button, Snackbar, Alert } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Navigation from "../Navigation";
import SignIn from '../SignIn/index'
import {FirebaseContext} from '../Firebase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const MyProfile = ({authenticated, authUser}) => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('●●●●●●●●●●');

    const getUserDetails = async () => {
        const url = `/api/getUserDetails/${authUser.uid}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'}
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    useEffect(() => {
        if (authUser) {
            getUserDetails().then(res => {
                const data = JSON.parse(res.express);
                setEmail(data.email);
                setUsername(data.username);
                
            });
        }
    }, [authUser]);

    const [snackbarSeverity, setSnackbarSeverity] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarSeverity("");
        setSnackbarMessage("");
        setSnackbarOpen(false);
    };

    const updateUsername = async () => {
        const url = `/api/updateUsername`;
        const user = {
          id: authUser.uid,
          username
        };
        console.log(user);
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
          });
          const body = await response.json();
          if (response.status !== 200) {
            throw Error(body.message || 'Error');
          }
          setSnackbarSeverity("success");
          setSnackbarMessage("Username updated");
          setSnackbarOpen(true);
          return body;
        } catch (error) {
          console.error("Error updating username: ", error);
          setSnackbarSeverity("error");
          setSnackbarMessage("Failed to update username. Please try again");
          setSnackbarOpen(true);
        }
    };

    const navigate = useNavigate();

    const firebase = useContext(FirebaseContext);
    const updatePassword = () => {
        firebase
        .doPasswordUpdate(password)
        .then(() => {
            setSnackbarSeverity("success");
            setSnackbarMessage("Password updated");
            setSnackbarOpen(true);
        })
        .catch((error) => {
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to update password. Please try again");
            setSnackbarOpen(true);
            console.log("Error updating password: ", error);
        })
    };

    const deleteAccount = () => {
        firebase
        .doDeleteAccount()
        .then(() => {
            navigate("/");
        })
        .catch((error) => {
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to delete account. Please try again");
            setSnackbarOpen(true);
            console.log("Error deleting account: ", error);
        })
    };

    const deleteAccountInDB = async (id) => {
        try {
            await fetch(`/api/deleteAccount/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const [dialogOpen, setDialogOpen] = useState(false);

    if (authUser) {
        return (
            <>
                <Navigation/>
                <Grid container align="center" paddingTop={5}>
                    <Grid item xs={12}>
                        <AccountCircleIcon sx={{width: "100px", height: "100px"}}/>
                    </Grid>
                    <Grid item xs={12} padding={2}>
                        <TextField
                            disabled
                            label="Email"
                            value={email}
                            sx={{width: "400px"}}
                        />
                    </Grid>
                    <Grid container padding={1} spacing={2}>
                        <Grid item xs={6} align="right">
                            <TextField
                                label="Username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                sx={{width: "250px"}}
                            />
                        </Grid>
                        <Grid item xs={6} align="left">
                            <Button onClick={() => updateUsername()}>Update username</Button>
                        </Grid>
                    </Grid>
                    <Grid container padding={1} spacing={2}>
                        <Grid item xs={6} align="right">
                            <TextField
                                label="Password"
                                value={password}
                                onFocus={() => setPassword('')}
                                onChange={(event) => setPassword(event.target.value)}
                                sx={{width: "250px"}}
                            />
                        </Grid>
                        <Grid item xs={6} align="left">
                            <Button onClick={() => updatePassword()}>Update password</Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Button sx={{color: "red"}} onClick={() => setDialogOpen(true)}>Delete my account</Button>
                        </Grid>
                    </Grid>
                    <Grid container padding={1} spacing={2}>
                        <Grid item xs={6} align="right">
                            <Button variant="contained" onClick={() => navigate("/myposts")}>My Posts</Button>
                        </Grid>
                        <Grid item xs={6} align="left">
                            <Button variant="contained" onClick={() => navigate("/mycourses")}>My Courses</Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'right'}} open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Dialog
                    open={dialogOpen}
                    onClose={() => {setDialogOpen(false)}}
                >
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete your account? Once it has been deleted it will be gone forever.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {setDialogOpen(false)}}>No</Button>
                        <Button 
                            onClick={() => {
                                deleteAccountInDB(authUser.uid);
                                deleteAccount();
                            }}
                        >
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    } 
    return (
        <SignIn />
    );
}

export default MyProfile;
