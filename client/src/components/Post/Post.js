import { useParams } from 'react-router-dom';
import React from "react";
import Grid from "@mui/material/Grid";
import { Button, TextField, Typography, Rating, Paper , Snackbar, Alert } from '@mui/material';
import Navigation from '../Navigation';
import { format } from 'date-fns';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const Post = () => {
    let { post_id } = useParams();
    const [post, setPost] = React.useState();

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);

    const [comments, setComments] = React.useState([]);
    const [averageRating, setAverageRating] = React.useState(0);
    const [comment, setComment] = React.useState('');
    const [rating, setRating] = React.useState(0);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    React.useEffect(() => {
        callApiLoadPost(post_id).then(res => {
            const data = JSON.parse(res.express);
            setPost(data[0]);
        });

        const loadComments = async () => {
            const response = await fetch(`/api/posts/${post_id}/comments`);
            const data = await response.json();
            if (response.ok) {
                setComments(data.comments);
            }
        };

        const loadAverageRating = async () => {
            const response = await fetch(`/api/posts/${post_id}/averageRating`);
            const data = await response.json();
            if (response.ok) {
                setAverageRating(data.average);
            }
        };

        loadComments();
        loadAverageRating();
    }, [post_id]);

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
            await fetch(`/api/posts/${post_id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment }),
            });

            setSnackbarMessage('Review submitted successfully!');
            setSnackbarOpen(true);

            setRating(0);
            setComment('');

            const response1 = await fetch(`/api/posts/${post_id}/averageRating`);
            const data1 = await response1.json();
            setAverageRating(data1.average);

            const response2 = await fetch(`/api/posts/${post_id}/comments`);
            const data2 = await response2.json();
            setComments(data2.comments);
        } catch (error) {
            console.error('Error submitting rating:', error);
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
                        <Typography>Date Posted: {format(new Date(post.date_posted), 'MM-dd-yyyy')}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
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
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            </>
        );
    }
}
export default Post;