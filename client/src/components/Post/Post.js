import { useParams, useNavigate } from 'react-router-dom';
import React from "react";
import Grid from "@mui/material/Grid";
import { Button, TextField, Typography, Rating, Paper , Snackbar, Alert } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Navigation from '../Navigation';
import { format } from 'date-fns';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import DeleteIcon from '@mui/icons-material/Delete';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const Post = ({authenticated, authUser}) => {
    let { post_id } = useParams();
    const [post, setPost] = React.useState();
    const [comments, setComments] = React.useState([]);

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);

    const [comment, setComment] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const callApiLoadPost = async (post_id) => {
        const url = `/api/getPost/${post_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    const callApiLoadComments = async (post_id) => {
        const url = `/api/getComments/${post_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    React.useEffect(() => {
        callApiLoadPost(post_id).then(res => {
            const data = JSON.parse(res.express);
            setPost(data[0]);
            console.log(data[0]);
        });
        callApiLoadComments(post_id).then(res => {
            const data = JSON.parse(res.express);
            setComments(data);
            console.log(data);
        });
    }, [post_id]);

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const submitReview = async () => {
        try {
            await fetch(`/api/postReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id, user_id: authUser.uid, rating, comment }),
            });

            setSnackbarMessage('Review submitted');
            setSnackbarOpen(true);

            setRating(0);
            setComment('');

            callApiLoadPost(post_id).then(res => {
                const data = JSON.parse(res.express);
                setPost(data[0]);
            });
            callApiLoadComments(post_id).then(res => {
                const data = JSON.parse(res.express);
                setComments(data);
            });
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const navigate = useNavigate();
    const callApiDeletePost = async (user_id) => {
        const url = `/api/deletePost/${user_id}/${post_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        navigate("/");
    };

    const deleteReview = async (id) => {
        try {
            await fetch(`/api/deleteReview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, user_id: authUser.uid }),
            });

            setSnackbarMessage('Review deleted');
            setSnackbarOpen(true);

            callApiLoadPost(post_id).then(res => {
                const data = JSON.parse(res.express);
                setPost(data[0]);
            });
            callApiLoadComments(post_id).then(res => {
                const data = JSON.parse(res.express);
                setComments(data);
            });
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    if (post) { 
        return (
            <>
            <Navigation/>
            <Grid container>
                <Grid item xs={8}>
                    <Grid item xs={12} margin={3}>
                        <Typography sx={{ fontWeight: 700, fontSize: '30px' }}>{post.title}</Typography>
                    </Grid>
                    {post.file_type === "PDF" &&
                        <Grid item xs={12} margin={3}>
                        <Paper>
                            <Document file={post.file} onLoadSuccess={onDocumentLoadSuccess}>
                                <Page pageNumber={pageNumber}  />
                            </Document>
                        </Paper>
                        <div>
                            <Button disabled={pageNumber <= 1} onClick={previousPage}>Previous</Button>
                            <Button disabled={pageNumber >= numPages} onClick={nextPage}>Next</Button>
                        </div>
                        <Typography>Page {pageNumber} of {numPages}</Typography>
                        </Grid>
                    }
                    {post.file_type === "IMG" &&
                        <Grid item xs={12} margin={3}>
                            <img src={post.file} style={{width: "80%"}}></img>
                        </Grid>
                    }
                    <Grid item xs={12} margin={3}>
                        <Typography>Description: {post.description}</Typography>
                    </Grid>
                    <Grid item xs={12} margin={3}>
                        <Typography>Author: {post.username}</Typography>
                    </Grid>
                    <Grid item xs={12} margin={3}>
                        <Typography>Date Posted: {format(new Date(post.date_posted), 'MM-dd-yyyy')}</Typography>
                    </Grid>
                    {(post.file_type === "PDF" || post.file_type === "IMG") &&
                        <Grid item xs={12} margin={3}>
                            <Button
                                variant="contained"
                                component="a"
                                href={post.file} // Ensure this is the URL to the actual image file
                                download
                            >
                                Download File
                            </Button>
                        </Grid>
                    }
                    {(authUser && authUser.uid === post.user_id) &&
                        <Grid container>
                            <Grid item xs={12} margin={3}>
                                <Button onClick={() => setDialogOpen(true)}>Delete this post</Button>
                            </Grid>
                        </Grid>
                    }
                </Grid>
                <Grid item xs={4}>
                    <Grid container>
                        <Grid item xs={12} margin={3}>
                            <Typography sx={{ fontWeight: 700, fontSize: '30px' }}>Review this post</Typography>
                        </Grid>
                        <Grid item xs={12} margin={3}>
                            Rating:
                            <Rating value={rating} onChange={(event, newValue) => setRating(newValue)}/>
                        </Grid>
                        <Grid item xs={12} margin={3}>
                            Comments: <TextField multiline rows={8} sx={{width:"100%"}} value={comment} onChange={(event) => setComment(event.target.value)}/>
                        </Grid>
                        <Grid item xs={12} margin={3}>
                            <Button variant="contained" onClick={submitReview}>Submit</Button>
                        </Grid>
                    </Grid>
                    <Grid xs={12} paddingTop={2} margin={3} display="flex">
                        <Typography>Rating: </Typography>
                        <Rating readOnly value={post.rating}/>
                    </Grid>
                    <Grid xs={12} margin={3}>
                        <Typography>Comments: </Typography>
                    </Grid>
                    {comments.map((comment) => (
                        <Grid container padding={4}>
                        <Grid xs={6}>
                            <Typography>{comment.comment} </Typography>
                        </Grid>
                        {authUser && authUser.uid === comment.user_id &&
                            <Grid xs={6} align="right">
                                <DeleteIcon onClick={() => deleteReview(comment.id)}/>
                            </Grid>
                        }
                        <Grid xs={6}>
                            <Typography>Reviewer: {comment.username} </Typography>
                        </Grid>
                        <Grid xs={6}>
                            <Typography>{format(new Date(post.date_posted), 'MM-dd-yyyy')} </Typography>
                        </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog
                open={dialogOpen}
                onClose={() => {setDialogOpen(false)}}
            >
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this post? Once it has been deleted it will be gone forever.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setDialogOpen(false)}}>No</Button>
                    <Button onClick={() => callApiDeletePost(authUser.uid)}>Yes</Button>
                </DialogActions>
            </Dialog>
            </>
        );
    }
}
export default Post;